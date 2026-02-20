const express = require('express');
const router = express.Router();
const { get, run, all } = require('../database-postgres');
const { verifyToken } = require('../auth');

// Load card data
const { cardsByName, cardsByRarity, CARD_PRICES, PACK_PRICES } = require('./cards-data');
const ALL_CARDS = require('./cards-data').ALL_CARDS;

// All routes require authentication
router.use(verifyToken);

// Get store data
router.get('/data', async (req, res) => {
    try {
        const userId = req.userId;
        
        // Get current store rotation
        const storeCards = await all(
            'SELECT card_name FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) = CURRENT_DATE',
            [userId]
        );

        // If no cards for today, generate new rotation
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

// Buy a pack
router.post('/buy-pack', async (req, res) => {
    try {
        const userId = req.userId;
        const { packType } = req.body;

        // Validate pack type
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

        // Log transaction
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

        console.log(`📦 Pack purchased by user ${userId}: ${packType}`);

        res.json({
            success: true,
            cards,
            newGold,
            newGems
        });
    } catch (error) {
        console.error('Error buying pack:', error);
        res.status(500).json({ error: 'Failed to purchase pack' });
    }
});

// Buy single card
router.post('/buy-card', async (req, res) => {
    try {
        const userId = req.userId;
        const { cardName, price } = req.body;

        // Validate card exists
        const card = cardsByName[cardName];
        if (!card) {
            console.log('[STORE] Invalid card attempted:', cardName);
            return res.status(400).json({ error: 'Invalid card' });
        }

        // Get player's current balance
        const playerData = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Validate price matches card rarity
        const expectedPrice = CARD_PRICES[card.rarity];
        if (price !== expectedPrice) {
            return res.status(400).json({ error: 'Invalid price' });
        }

        // Check if player can afford it
        if (playerData.gold < price) {
            return res.status(400).json({ error: 'Not enough gold' });
        }

        // No more ownership limits with trading system
        // Users can own unlimited copies of any card

        // Deduct gold
        const newGold = playerData.gold - price;

        await run(
            'UPDATE player_data SET gold = ? WHERE user_id = ?',
            [newGold, userId]
        );

        // Add card instance with variant
        const crypto = require('crypto');
        const instanceId = `card_${crypto.randomBytes(16).toString('hex')}`;
        
        await run(`
            INSERT INTO card_instances (id, user_id, card_name, art_variant, acquired_from)
            VALUES (?, ?, ?, 'standard', 'store_purchase')
        `, [instanceId, userId, cardName]);

        // Also update owned_cards for backwards compatibility
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

        console.log(`🃏 Card purchased by user ${userId}: ${cardName}`);

        res.json({
            success: true,
            cardName,
            newGold
        });
    } catch (error) {
        console.error('Error buying card:', error);
        res.status(500).json({ error: 'Failed to purchase card' });
    }
});

// Helper: Add card to collection (using card instances)
async function addCardToCollection(userId, cardName, variant = 'standard', source = 'pack_purchase') {
    const crypto = require('crypto');
    const instanceId = `card_${crypto.randomBytes(16).toString('hex')}`;
    
    await run(`
        INSERT INTO card_instances (id, user_id, card_name, art_variant, acquired_from)
        VALUES (?, ?, ?, ?, ?)
    `, [instanceId, userId, cardName, variant, source]);

    // Also update owned_cards for backwards compatibility during transition
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

// Helper: Generate pack cards with Full Art upgrade logic
function generatePackCards(pack, packType = 'basic') {
    const cards = [];
    
    for (let i = 0; i < pack.cards; i++) {
        const rarity = getRandomRarity(pack.rates);
        const rarityCards = cardsByRarity[rarity] || cardsByRarity.common;
        let card = rarityCards[Math.floor(Math.random() * rarityCards.length)];
        
        // 5% chance for Full Art if legendary pack or starter bundle
        if ((packType === 'legendary' || packType === 'starter_bundle') && Math.random() < 0.05) {
            // Check if Full Art variant exists for this card
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

// Helper: Generate store rotation
async function generateStoreRotation(userId) {
    // Clear old rotation
    await run(
        'DELETE FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) < DATE("now")',
        [userId]
    );

    // Generate 6 random cards for daily store
    const storeCards = [];
    
    // 2 common, 2 rare, 1 epic, 1 legendary
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

    // Insert into database
    for (const card of storeCards) {
        await run(
            'INSERT INTO store_rotation (user_id, card_name) VALUES (?, ?)',
            [userId, card.name]
        );
    }
}

// Get used cards available in store
router.get('/used-cards', async (req, res) => {
    try {
        const userId = req.userId;

        // Get all used cards, grouped by card_name and art_variant
        const usedCards = await all(`
            SELECT 
                suc.card_name,
                suc.art_variant,
                COUNT(*) as quantity,
                MIN(suc.base_list_price) as base_list_price,
                MIN(suc.listed_at) as oldest_listing,
                STRING_AGG(suc.id::text, ',') as listing_ids
            FROM store_used_cards suc
            GROUP BY suc.card_name, suc.art_variant
            ORDER BY suc.card_name
        `);

        // For each group, calculate current price with depreciation
        const usedCardsWithPrices = usedCards.map(group => {
            const daysSinceListed = Math.floor(
                (Date.now() - new Date(group.oldest_listing)) / (1000 * 60 * 60 * 24)
            );

            // Time depreciation schedule
            let depreciationMultiplier = 1.0;
            if (daysSinceListed >= 30) depreciationMultiplier = 0.75;      // 75% (floor)
            else if (daysSinceListed >= 21) depreciationMultiplier = 0.775; // 77.5%
            else if (daysSinceListed >= 14) depreciationMultiplier = 0.80;  // 80%
            else if (daysSinceListed >= 7) depreciationMultiplier = 0.825;  // 82.5%
            // else 85% (no depreciation yet)

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

// Buy a used card
router.post('/buy-used-card', async (req, res) => {
    try {
        const userId = req.userId;
        const { cardName, artVariant } = req.body;

        // Get oldest listing for this card+variant (FIFO)
        const usedCard = await get(`
            SELECT suc.*, ci.id as instance_id
            FROM store_used_cards suc
            JOIN card_instances ci ON suc.card_instance_id = ci.id
            WHERE suc.card_name = ? 
            AND suc.art_variant = ?
            ORDER BY suc.listed_at ASC
            LIMIT 1
        `, [cardName, artVariant || 'standard']);

        if (!usedCard) {
            return res.status(404).json({ error: 'Card not available in used market' });
        }

        // Calculate current price with depreciation
        const daysSinceListed = Math.floor(
            (Date.now() - new Date(usedCard.listed_at)) / (1000 * 60 * 60 * 24)
        );

        let depreciationMultiplier = 1.0;
        if (daysSinceListed >= 30) depreciationMultiplier = 0.75;
        else if (daysSinceListed >= 21) depreciationMultiplier = 0.775;
        else if (daysSinceListed >= 14) depreciationMultiplier = 0.80;
        else if (daysSinceListed >= 7) depreciationMultiplier = 0.825;

        const currentPrice = Math.floor(usedCard.base_list_price * depreciationMultiplier);

        // Get player's current balance
        const playerData = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Check if player can afford it
        if (playerData.gold < currentPrice) {
            return res.status(400).json({ error: 'Not enough gold' });
        }

        // Deduct gold
        const newGold = playerData.gold - currentPrice;

        await run(
            'UPDATE player_data SET gold = ? WHERE user_id = ?',
            [newGold, userId]
        );

        // Transfer card instance to buyer
        await run(`
            UPDATE card_instances
            SET user_id = ?,
                previous_owners = json_insert(
                    COALESCE(previous_owners, '[]'), 
                    '$[#]', 
                    'store'
                )
            WHERE id = ?
        `, [userId, usedCard.instance_id]);

        // Remove from used cards inventory
        await run(`
            DELETE FROM store_used_cards
            WHERE id = ?
        `, [usedCard.id]);

        // Update owned_cards for backwards compatibility
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

        // Record market event (buyer valued it at this price)
        await run(`
            INSERT INTO market_events (card_name, event_type, event_value, metadata)
            VALUES (?, 'used_purchase', ?, ?)
        `, [cardName, currentPrice, JSON.stringify({ 
            card_instance_id: usedCard.instance_id,
            depreciation: depreciationMultiplier,
            days_listed: daysSinceListed
        })]);

        // Update market value
        const tradesRouter = require('./trades');
        await tradesRouter.updateMarketValue(cardName);

        console.log(`🃏 Used card purchased by user ${userId}: ${cardName} for ${currentPrice}g`);

        res.json({
            success: true,
            cardName,
            newGold,
            price_paid: currentPrice
        });

    } catch (error) {
        console.error('Error buying used card:', error);
        res.status(500).json({ error: 'Failed to purchase used card' });
    }
});

// Buy starter bundle (3 rare packs + 500 gold for 15 gems)
router.post('/buy-starter-bundle', async (req, res) => {
    try {
        const userId = req.userId;
        const bundleCost = 15; // gems
        const goldBonus = 500;
        const packCount = 3;

        // Get player's current balance
        const playerData = await get(
            'SELECT gold, gems FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Check if player can afford it
        if (playerData.gems < bundleCost) {
            return res.status(400).json({ error: 'Not enough gems' });
        }

        // Deduct gems and add gold bonus
        const newGems = playerData.gems - bundleCost;
        const newGold = playerData.gold + goldBonus;

        await run(
            'UPDATE player_data SET gold = ?, gems = ? WHERE user_id = ?',
            [newGold, newGems, userId]
        );

        // Generate 3 rare packs worth of cards (15 cards total) with Full Art upgrade
        const allCards = [];
        for (let p = 0; p < packCount; p++) {
            const pack = PACK_PRICES.rare;
            const packCards = generatePackCards(pack, 'starter_bundle');
            allCards.push(...packCards);
        }

        // Add cards to collection with variant preserved
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

        console.log(`🎁 Starter bundle purchased by user ${userId}`);

        res.json({
            success: true,
            cards: allCards,
            newGold,
            newGems,
            goldBonus
        });

    } catch (error) {
        console.error('Error buying starter bundle:', error);
        res.status(500).json({ error: 'Failed to purchase starter bundle' });
    }
});

module.exports = router;
