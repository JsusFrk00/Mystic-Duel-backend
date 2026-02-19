// DATABASE TRANSACTION FIX for store.js
// Wraps pack purchases in transactions to prevent gem loss on failures

const express = require('express');
const router = express.Router();
const { get, run, all, beginTransaction, commit, rollback } = require('../database');
const { verifyToken } = require('../auth');

// Load card data
const { cardsByName, cardsByRarity, CARD_PRICES, PACK_PRICES } = require('./cards-data');
const ALL_CARDS = require('./cards-data').ALL_CARDS;

// All routes require authentication
router.use(verifyToken);

// Get store data (unchanged)
router.get('/data', async (req, res) => {
    try {
        const userId = req.userId;
        
        const storeCards = await all(
            'SELECT card_name FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) = DATE("now")',
            [userId]
        );

        if (storeCards.length === 0) {
            await generateStoreRotation(userId);
            const newCards = await all(
                'SELECT card_name FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) = DATE("now")',
                [userId]
            );
            res.json({ storeCards: newCards.map(c => c.card_name) });
        } else {
            res.json({ storeCards: storeCards.map(c => c.card_name) });
        }
    } catch (error) {
        console.error('Error getting store data:', error);
        res.status(500).json({ error: 'Failed to get store data' });
    }
});

// Buy a pack - WITH TRANSACTION SAFETY
router.post('/buy-pack', async (req, res) => {
    try {
        const userId = req.userId;
        const { packType } = req.body;

        if (!PACK_PRICES[packType]) {
            return res.status(400).json({ error: 'Invalid pack type' });
        }

        const pack = PACK_PRICES[packType];

        // Get player's current balance
        const playerData = await get(
            'SELECT gold, gems FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Check if player can afford it
        if (pack.gold > 0 && playerData.gold < pack.gold) {
            return res.status(400).json({ error: 'Not enough gold' });
        }
        if (pack.gems > 0 && playerData.gems < pack.gems) {
            return res.status(400).json({ error: 'Not enough gems' });
        }

        // START TRANSACTION
        await beginTransaction();
        console.log('[TRANSACTION] Started pack purchase transaction');

        try {
            // Generate cards with Full Art upgrade logic
            const cards = generatePackCards(pack, packType);

            // Deduct cost
            const newGold = playerData.gold - (pack.gold || 0);
            const newGems = playerData.gems - (pack.gems || 0);

            await run(
                'UPDATE player_data SET gold = ?, gems = ? WHERE user_id = ?',
                [newGold, newGems, userId]
            );

            // Add cards to collection with variant preserved
            for (const card of cards) {
                await addCardToCollection(userId, card.name, card.variant || 'standard', `pack_${packType}`);
            }

            // Log transactions
            if (pack.gold > 0) {
                await run(
                    'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, 'spend', pack.gold, 'gold', playerData.gold, newGold, `pack_purchase_${packType}`, req.ip]
                );
            }
            if (pack.gems > 0) {
                await run(
                    'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, 'spend', pack.gems, 'gems', playerData.gems, newGems, `pack_purchase_${packType}`, req.ip]
                );
            }

            // COMMIT TRANSACTION - Everything succeeded
            await commit();
            console.log('[TRANSACTION] Committed pack purchase successfully');

            console.log(`📦 Pack purchased by user ${userId}: ${packType}`);

            res.json({
                success: true,
                cards,
                newGold,
                newGems
            });

        } catch (innerError) {
            // ROLLBACK on any error
            await rollback();
            console.error('[TRANSACTION] Rolled back pack purchase due to error:', innerError);
            throw innerError; // Re-throw to outer catch
        }

    } catch (error) {
        console.error('Error buying pack:', error);
        res.status(500).json({ error: 'Failed to purchase pack - no charges made' });
    }
});

// Buy single card - WITH TRANSACTION SAFETY
router.post('/buy-card', async (req, res) => {
    try {
        const userId = req.userId;
        const { cardName, price } = req.body;

        const card = cardsByName[cardName];
        if (!card) {
            return res.status(400).json({ error: 'Invalid card' });
        }

        const playerData = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        const expectedPrice = CARD_PRICES[card.rarity];
        if (price !== expectedPrice) {
            return res.status(400).json({ error: 'Invalid price' });
        }

        if (playerData.gold < price) {
            return res.status(400).json({ error: 'Not enough gold' });
        }

        // START TRANSACTION
        await beginTransaction();

        try {
            const newGold = playerData.gold - price;

            await run(
                'UPDATE player_data SET gold = ? WHERE user_id = ?',
                [newGold, userId]
            );

            // Add card instance
            const crypto = require('crypto');
            const instanceId = `card_${crypto.randomBytes(16).toString('hex')}`;
            
            await run(`
                INSERT INTO card_instances (id, user_id, card_name, art_variant, acquired_from)
                VALUES (?, ?, ?, 'standard', 'store_purchase')
            `, [instanceId, userId, cardName]);

            // Update owned_cards
            const existing = await get(
                'SELECT count FROM owned_cards WHERE user_id = ? AND card_name = ?',
                [userId, cardName]
            );

            if (existing) {
                await run(
                    'UPDATE owned_cards SET count = count + 1 WHERE user_id = ? AND card_name = ?',
                    [userId, cardName]
                );
            } else {
                await run(
                    'INSERT INTO owned_cards (user_id, card_name, count) VALUES (?, ?, 1)',
                    [userId, cardName]
                );
            }

            // Log transaction
            await run(
                'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, 'spend', price, 'gold', playerData.gold, newGold, `card_purchase_${cardName}`, req.ip]
            );

            // COMMIT
            await commit();
            console.log(`🃏 Card purchased by user ${userId}: ${cardName}`);

            res.json({
                success: true,
                cardName,
                newGold
            });

        } catch (innerError) {
            await rollback();
            console.error('[TRANSACTION] Rolled back card purchase:', innerError);
            throw innerError;
        }

    } catch (error) {
        console.error('Error buying card:', error);
        res.status(500).json({ error: 'Failed to purchase card' });
    }
});

// Buy starter bundle - WITH TRANSACTION SAFETY
router.post('/buy-starter-bundle', async (req, res) => {
    try {
        const userId = req.userId;
        const bundleCost = 15;
        const goldBonus = 500;
        const packCount = 3;

        const playerData = await get(
            'SELECT gold, gems FROM player_data WHERE user_id = ?',
            [userId]
        );

        if (playerData.gems < bundleCost) {
            return res.status(400).json({ error: 'Not enough gems' });
        }

        // START TRANSACTION
        await beginTransaction();

        try {
            const newGems = playerData.gems - bundleCost;
            const newGold = playerData.gold + goldBonus;

            await run(
                'UPDATE player_data SET gold = ?, gems = ? WHERE user_id = ?',
                [newGold, newGems, userId]
            );

            // Generate cards
            const allCards = [];
            for (let p = 0; p < packCount; p++) {
                const pack = PACK_PRICES.rare;
                const packCards = generatePackCards(pack, 'starter_bundle');
                allCards.push(...packCards);
            }

            // Add all cards
            for (const card of allCards) {
                await addCardToCollection(userId, card.name, card.variant || 'standard', 'starter_bundle');
            }

            // Log transactions
            await run(
                'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, 'spend', bundleCost, 'gems', playerData.gems, newGems, 'starter_bundle_purchase', req.ip]
            );

            await run(
                'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, 'earn', goldBonus, 'gold', playerData.gold, newGold, 'starter_bundle_bonus', req.ip]
            );

            // COMMIT
            await commit();
            console.log(`🎁 Starter bundle purchased by user ${userId}`);

            res.json({
                success: true,
                cards: allCards,
                newGold,
                newGems,
                goldBonus
            });

        } catch (innerError) {
            await rollback();
            console.error('[TRANSACTION] Rolled back starter bundle:', innerError);
            throw innerError;
        }

    } catch (error) {
        console.error('Error buying starter bundle:', error);
        res.status(500).json({ error: 'Failed to purchase starter bundle' });
    }
});

// Helper functions (unchanged)
async function addCardToCollection(userId, cardName, variant = 'standard', source = 'pack_purchase') {
    const crypto = require('crypto');
    const instanceId = `card_${crypto.randomBytes(16).toString('hex')}`;
    
    await run(`
        INSERT INTO card_instances (id, user_id, card_name, art_variant, acquired_from)
        VALUES (?, ?, ?, ?, ?)
    `, [instanceId, userId, cardName, variant, source]);

    const existing = await get(
        'SELECT count FROM owned_cards WHERE user_id = ? AND card_name = ?',
        [userId, cardName]
    );

    if (existing) {
        await run(
            'UPDATE owned_cards SET count = count + 1 WHERE user_id = ? AND card_name = ?',
            [userId, cardName]
        );
    } else {
        await run(
            'INSERT INTO owned_cards (user_id, card_name, count) VALUES (?, ?, 1)',
            [userId, cardName]
        );
    }
}

function generatePackCards(pack, packType = 'basic') {
    const cards = [];
    
    for (let i = 0; i < pack.cards; i++) {
        const rarity = getRandomRarity(pack.rates);
        const rarityCards = cardsByRarity[rarity] || cardsByRarity.common;
        let card = rarityCards[Math.floor(Math.random() * rarityCards.length)];
        
        if ((packType === 'legendary' || packType === 'starter_bundle') && Math.random() < 0.05) {
            const fullArtCard = ALL_CARDS.find(c => 
                c.name === card.name && c.variant === 'Full Art'
            );
            if (fullArtCard) {
                card = fullArtCard;
                console.log(`[✨ Full Art] Upgraded ${card.name} to Full Art!`);
            }
        }
        
        cards.push(card);
    }

    return cards;
}

function getRandomRarity(rates) {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (rand < cumulative) return rarity;
    }
    
    return 'common';
}

async function generateStoreRotation(userId) {
    await run(
        'DELETE FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) < DATE("now")',
        [userId]
    );

    const storeCards = [];
    const distribution = [
        { rarity: 'common', count: 2 },
        { rarity: 'rare', count: 2 },
        { rarity: 'epic', count: 1 },
        { rarity: 'legendary', count: 1 }
    ];

    for (const { rarity, count } of distribution) {
        const rarityCards = cardsByRarity[rarity];
        for (let i = 0; i < count; i++) {
            const card = rarityCards[Math.floor(Math.random() * rarityCards.length)];
            if (!storeCards.find(c => c.name === card.name)) {
                storeCards.push(card);
            }
        }
    }

    for (const card of storeCards) {
        await run(
            'INSERT INTO store_rotation (user_id, card_name) VALUES (?, ?)',
            [userId, card.name]
        );
    }
}

// Get used cards (unchanged)
router.get('/used-cards', async (req, res) => {
    try {
        const usedCards = await all(`
            SELECT 
                suc.card_name,
                suc.art_variant,
                COUNT(*) as quantity,
                MIN(suc.base_list_price) as base_list_price,
                MIN(suc.listed_at) as oldest_listing
            FROM store_used_cards suc
            GROUP BY suc.card_name, suc.art_variant
            ORDER BY suc.card_name
        `);

        const usedCardsWithPrices = usedCards.map(group => {
            const daysSinceListed = Math.floor(
                (Date.now() - new Date(group.oldest_listing)) / (1000 * 60 * 60 * 24)
            );

            let depreciationMultiplier = 1.0;
            if (daysSinceListed >= 30) depreciationMultiplier = 0.75;
            else if (daysSinceListed >= 21) depreciationMultiplier = 0.775;
            else if (daysSinceListed >= 14) depreciationMultiplier = 0.80;
            else if (daysSinceListed >= 7) depreciationMultiplier = 0.825;

            const currentPrice = Math.floor(group.base_list_price * depreciationMultiplier);

            return {
                card_name: group.card_name,
                art_variant: group.art_variant,
                quantity: group.quantity,
                base_list_price: group.base_list_price,
                current_price: currentPrice,
                days_listed: daysSinceListed,
                depreciation: Math.round((1 - depreciationMultiplier) * 100) + '%'
            };
        });

        res.json({ used_cards: usedCardsWithPrices });

    } catch (error) {
        console.error('Error getting used cards:', error);
        res.status(500).json({ error: 'Failed to get used cards' });
    }
});

// Buy used card - WITH TRANSACTION SAFETY
router.post('/buy-used-card', async (req, res) => {
    try {
        const userId = req.userId;
        const { cardName, artVariant } = req.body;

        const usedCard = await get(`
            SELECT suc.*, ci.id as instance_id
            FROM store_used_cards suc
            JOIN card_instances ci ON suc.card_instance_id = ci.id
            WHERE suc.card_name = ? AND suc.art_variant = ?
            ORDER BY suc.listed_at ASC
            LIMIT 1
        `, [cardName, artVariant || 'standard']);

        if (!usedCard) {
            return res.status(404).json({ error: 'Card not available' });
        }

        // Calculate price
        const daysSinceListed = Math.floor(
            (Date.now() - new Date(usedCard.listed_at)) / (1000 * 60 * 60 * 24)
        );

        let depreciationMultiplier = 1.0;
        if (daysSinceListed >= 30) depreciationMultiplier = 0.75;
        else if (daysSinceListed >= 21) depreciationMultiplier = 0.775;
        else if (daysSinceListed >= 14) depreciationMultiplier = 0.80;
        else if (daysSinceListed >= 7) depreciationMultiplier = 0.825;

        const currentPrice = Math.floor(usedCard.base_list_price * depreciationMultiplier);

        const playerData = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        if (playerData.gold < currentPrice) {
            return res.status(400).json({ error: 'Not enough gold' });
        }

        // START TRANSACTION
        await beginTransaction();

        try {
            const newGold = playerData.gold - currentPrice;

            await run(
                'UPDATE player_data SET gold = ? WHERE user_id = ?',
                [newGold, userId]
            );

            // Transfer card
            await run(`
                UPDATE card_instances
                SET user_id = ?,
                    previous_owners = json_insert(COALESCE(previous_owners, '[]'), '$[#]', 'store')
                WHERE id = ?
            `, [userId, usedCard.instance_id]);

            // Remove from store
            await run(`DELETE FROM store_used_cards WHERE id = ?`, [usedCard.id]);

            // Update owned_cards
            const existing = await get(
                'SELECT count FROM owned_cards WHERE user_id = ? AND card_name = ?',
                [userId, cardName]
            );

            if (existing) {
                await run(
                    'UPDATE owned_cards SET count = count + 1 WHERE user_id = ? AND card_name = ?',
                    [userId, cardName]
                );
            } else {
                await run(
                    'INSERT INTO owned_cards (user_id, card_name, count) VALUES (?, ?, 1)',
                    [userId, cardName]
                );
            }

            // Log transaction
            await run(
                'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, 'spend', currentPrice, 'gold', playerData.gold, newGold, `used_card_purchase_${cardName}`, req.ip]
            );

            // Record market event
            await run(`
                INSERT INTO market_events (card_name, event_type, event_value, metadata)
                VALUES (?, 'used_purchase', ?, ?)
            `, [cardName, currentPrice, JSON.stringify({ 
                card_instance_id: usedCard.instance_id,
                depreciation: depreciationMultiplier,
                days_listed: daysSinceListed
            })]);

            // COMMIT
            await commit();
            console.log(`🃏 Used card purchased by user ${userId}: ${cardName}`);

            res.json({
                success: true,
                cardName,
                newGold,
                price_paid: currentPrice
            });

        } catch (innerError) {
            await rollback();
            console.error('[TRANSACTION] Rolled back used card purchase:', innerError);
            throw innerError;
        }

    } catch (error) {
        console.error('Error buying used card:', error);
        res.status(500).json({ error: 'Failed to purchase used card' });
    }
});

module.exports = router;
