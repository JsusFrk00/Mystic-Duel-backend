const express = require('express');
const router = express.Router();
const { get, run, all, beginTransaction, commit, rollback } = require('../database-postgres');
const { verifyToken } = require('../auth');
const crypto = require('crypto');

// All routes require authentication
router.use(verifyToken);

// ============ HELPER FUNCTIONS ============

// Generate unique card instance ID
function generateCardInstanceId() {
    return `card_${crypto.randomBytes(16).toString('hex')}`;
}

// Calculate market value from last 10 market events
async function calculateMarketValue(cardName) {
    // Get last 10 market events for this card
    const events = await all(`
        SELECT event_value
        FROM market_events
        WHERE card_name = ?
        ORDER BY created_at DESC
        LIMIT 10
    `, [cardName]);

    // Get base price
    const marketData = await get(
        'SELECT base_price FROM card_market_values WHERE card_name = ?',
        [cardName]
    );

    if (!marketData) return null;

    const basePrice = marketData.base_price;

    // If less than 10 events, fill with base price
    const eventValues = events.map(e => e.event_value);
    while (eventValues.length < 10) {
        eventValues.push(basePrice);
    }

    // Calculate average
    const sum = eventValues.reduce((a, b) => a + b, 0);
    const average = sum / eventValues.length;

    // Round up (player-friendly)
    const newValue = Math.ceil(average);

    // Apply caps (50% min, 300% max of base price)
    const cappedValue = Math.min(newValue, basePrice * 3);
    const flooredValue = Math.max(cappedValue, basePrice * 0.5);

    return flooredValue;
}

// Update market value for a card
async function updateMarketValue(cardName) {
    const newValue = await calculateMarketValue(cardName);
    if (newValue) {
        await run(`
            UPDATE card_market_values 
            SET current_market_value = ?, 
                last_updated = CURRENT_TIMESTAMP
            WHERE card_name = ?
        `, [newValue, cardName]);
    }
}

// Create notification
async function createNotification(userId, type, relatedId, message) {
    await run(`
        INSERT INTO notifications (user_id, type, related_id, message)
        VALUES (?, ?, ?, ?)
    `, [userId, type, relatedId, message]);
}

// ============ ROUTES ============

// Get all open listings (trading block)
router.get('/listings', async (req, res) => {
    try {
        const userId = req.userId;

        // Get all open listings (not created by current user)
        const listings = await all(`
            SELECT 
                tl.id,
                tl.created_at,
                tl.expires_at,
                (SELECT COUNT(*) FROM trade_listing_offers WHERE listing_id = tl.id) as offered_count,
                (SELECT STRING_AGG(card_name, ',') FROM trade_listing_requests WHERE listing_id = tl.id) as requested_cards
            FROM trade_listings tl
            WHERE tl.status = 'open'
            AND tl.posted_by_user_id != ?
            AND tl.expires_at > NOW()
            ORDER BY tl.created_at DESC
        `, [userId]);

        // For each listing, get offered cards (just names, not instances - anonymous)
        for (const listing of listings) {
            const offeredCards = await all(`
                SELECT ci.card_name, COUNT(*) as quantity
                FROM trade_listing_offers tlo
                JOIN card_instances ci ON tlo.card_instance_id = ci.id
                WHERE tlo.listing_id = ?
                GROUP BY ci.card_name
            `, [listing.id]);

            listing.offered_cards = offeredCards;
            listing.requested_cards = listing.requested_cards ? listing.requested_cards.split(',') : [];
        }

        res.json({ listings });

    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// Get my listings
router.get('/my-listings', async (req, res) => {
    try {
        const userId = req.userId;

        const listings = await all(`
            SELECT 
                tl.id,
                tl.status,
                tl.created_at,
                tl.expires_at
            FROM trade_listings tl
            WHERE tl.posted_by_user_id = ?
            ORDER BY tl.created_at DESC
        `, [userId]);

        for (const listing of listings) {
            // Get offered cards with instance IDs
            const offeredCards = await all(`
                SELECT ci.id, ci.card_name
                FROM trade_listing_offers tlo
                JOIN card_instances ci ON tlo.card_instance_id = ci.id
                WHERE tlo.listing_id = ?
            `, [listing.id]);

            // Get requested cards
            const requestedCards = await all(`
                SELECT card_name, quantity
                FROM trade_listing_requests
                WHERE listing_id = ?
            `, [listing.id]);

            // Get pending counter-offers
            const counterOffers = await all(`
                SELECT 
                    tr.id,
                    tr.status,
                    tr.created_at,
                    u.username as responder_username
                FROM trade_responses tr
                JOIN users u ON tr.responder_user_id = u.id
                WHERE tr.listing_id = ?
                AND tr.status = 'pending'
            `, [listing.id]);

            // For each counter-offer, get what they're offering
            for (const offer of counterOffers) {
                const offeredInCounter = await all(`
                    SELECT ci.card_name, COUNT(*) as quantity
                    FROM trade_response_offers tro
                    JOIN card_instances ci ON tro.card_instance_id = ci.id
                    WHERE tro.response_id = ?
                    GROUP BY ci.card_name
                `, [offer.id]);
                offer.offered_cards = offeredInCounter;
            }

            listing.offered_cards = offeredCards;
            listing.requested_cards = requestedCards;
            listing.counter_offers = counterOffers;
        }

        res.json({ listings });

    } catch (error) {
        console.error('Error fetching my listings:', error);
        res.status(500).json({ error: 'Failed to fetch your listings' });
    }
});

// Get my counter-offers
router.get('/my-offers', async (req, res) => {
    try {
        const userId = req.userId;

        const offers = await all(`
            SELECT 
                tr.id,
                tr.listing_id,
                tr.status,
                tr.created_at,
                tr.expires_at,
                tl.posted_by_user_id as listing_owner_id
            FROM trade_responses tr
            JOIN trade_listings tl ON tr.listing_id = tl.id
            WHERE tr.responder_user_id = ?
            ORDER BY tr.created_at DESC
        `, [userId]);

        for (const offer of offers) {
            // Get what I'm offering
            const offeredCards = await all(`
                SELECT ci.card_name, COUNT(*) as quantity
                FROM trade_response_offers tro
                JOIN card_instances ci ON tro.card_instance_id = ci.id
                WHERE tro.response_id = ?
                GROUP BY ci.card_name
            `, [offer.id]);

            // Get what the original listing wants
            const requestedCards = await all(`
                SELECT card_name, quantity
                FROM trade_listing_requests
                WHERE listing_id = ?
            `, [offer.listing_id]);

            offer.offered_cards = offeredCards;
            offer.original_request = requestedCards;
        }

        res.json({ offers });

    } catch (error) {
        console.error('Error fetching my offers:', error);
        res.status(500).json({ error: 'Failed to fetch your offers' });
    }
});

// Create new listing
router.post('/create-listing', async (req, res) => {
    try {
        const userId = req.userId;
        const { offeredCardIds, requestedCards } = req.body;

        // Validate inputs
        if (!Array.isArray(offeredCardIds) || offeredCardIds.length === 0) {
            return res.status(400).json({ error: 'Must offer at least one card' });
        }

        if (!Array.isArray(requestedCards) || requestedCards.length === 0) {
            return res.status(400).json({ error: 'Must request at least one card' });
        }

        // Verify user owns all offered cards
        for (const cardId of offeredCardIds) {
            const card = await get(
                'SELECT user_id FROM card_instances WHERE id = ?',
                [cardId]
            );

            if (!card || card.user_id !== userId) {
                return res.status(403).json({ error: 'You do not own all offered cards' });
            }
        }

        // Create listing
        const result = await run(`
            INSERT INTO trade_listings (posted_by_user_id, status)
            VALUES (?, 'open')
        `, [userId]);

        const listingId = result.id;

        // Add offered cards
        for (const cardId of offeredCardIds) {
            await run(`
                INSERT INTO trade_listing_offers (listing_id, card_instance_id)
                VALUES (?, ?)
            `, [listingId, cardId]);
        }

        // Add requested cards
        for (const cardName of requestedCards) {
            await run(`
                INSERT INTO trade_listing_requests (listing_id, card_name, quantity)
                VALUES (?, ?, 1)
            `, [listingId, cardName]);
        }

        console.log(`📋 Listing ${listingId} created by user ${userId}`);

        res.json({
            success: true,
            listing_id: listingId
        });

    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// Accept listing (exact match)
router.post('/accept-listing/:id', async (req, res) => {
    try {
        const userId = req.userId;
        const listingId = parseInt(req.params.id);
        const { cardInstanceIds } = req.body;

        await beginTransaction();

        try {
            // Get listing
            const listing = await get(`
                SELECT * FROM trade_listings
                WHERE id = ? AND status = 'open'
            `, [listingId]);

            if (!listing) {
                await rollback();
                return res.status(404).json({ error: 'Listing not found or already completed' });
            }

            // Cannot accept own listing
            if (listing.posted_by_user_id === userId) {
                await rollback();
                return res.status(400).json({ error: 'Cannot accept your own listing' });
            }

            // Get what listing is requesting
            const requestedCards = await all(`
                SELECT card_name, quantity
                FROM trade_listing_requests
                WHERE listing_id = ?
            `, [listingId]);

            // Verify user is providing exactly what's requested
            const providedCards = {};
            for (const cardId of cardInstanceIds) {
                const card = await get(
                    'SELECT user_id, card_name FROM card_instances WHERE id = ?',
                    [cardId]
                );

                if (!card || card.user_id !== userId) {
                    await rollback();
                    return res.status(403).json({ error: 'You do not own all provided cards' });
                }

                providedCards[card.card_name] = (providedCards[card.card_name] || 0) + 1;
            }

            // Check if provided matches requested
            for (const req of requestedCards) {
                if (!providedCards[req.card_name] || providedCards[req.card_name] < req.quantity) {
                    await rollback();
                    return res.status(400).json({ 
                        error: `Missing required card: ${req.card_name} x${req.quantity}` 
                    });
                }
            }

            // Get offered cards
            const offeredCards = await all(`
                SELECT card_instance_id
                FROM trade_listing_offers
                WHERE listing_id = ?
            `, [listingId]);

            // Verify poster still owns offered cards
            for (const offer of offeredCards) {
                const card = await get(
                    'SELECT user_id FROM card_instances WHERE id = ?',
                    [offer.card_instance_id]
                );

                if (!card || card.user_id !== listing.posted_by_user_id) {
                    await rollback();
                    return res.status(400).json({ error: 'Poster no longer owns offered cards' });
                }
            }

            // EXECUTE TRADE
            // Transfer offered cards to accepter
            for (const offer of offeredCards) {
                await run(`
                    UPDATE card_instances
                    SET user_id = ?
                    WHERE id = ?
                `, [userId, offer.card_instance_id]);
            }

            // Transfer provided cards to poster
            for (const cardId of cardInstanceIds) {
                await run(`
                    UPDATE card_instances
                    SET user_id = ?
                    WHERE id = ?
                `, [listing.posted_by_user_id, cardId]);
            }

            // Mark listing as completed
            await run(`
                UPDATE trade_listings
                SET status = 'completed'
                WHERE id = ?
            `, [listingId]);

            // Record in trade history
            const tradeResult = await run(`
                INSERT INTO completed_trades (listing_id, user1_id, user2_id)
                VALUES (?, ?, ?)
            `, [listingId, listing.posted_by_user_id, userId]);

            const tradeId = tradeResult.id;

            // Record items traded
            for (const offer of offeredCards) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                await run(`
                    INSERT INTO trade_history_items (trade_id, from_user_id, to_user_id, card_instance_id, card_name)
                    VALUES (?, ?, ?, ?, ?)
                `, [tradeId, listing.posted_by_user_id, userId, offer.card_instance_id, card.card_name]);
            }

            for (const cardId of cardInstanceIds) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [cardId]);
                await run(`
                    INSERT INTO trade_history_items (trade_id, from_user_id, to_user_id, card_instance_id, card_name)
                    VALUES (?, ?, ?, ?, ?)
                `, [tradeId, userId, listing.posted_by_user_id, cardId, card.card_name]);
            }

            // Record market events for all cards traded
            const allCardNames = new Set();
            
            // Get offered cards with their trade values
            const listingOffers = offeredCards;  // Rename for clarity
            for (const offer of listingOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                allCardNames.add(card.card_name);
            }
            
            // Get requested cards with their trade values
            for (const cardId of cardInstanceIds) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [cardId]);
                allCardNames.add(card.card_name);
            }

            // For each card, calculate what it was valued at in the trade
            // Poster offered X cards, received Y cards
            // Event value = (total value received) / (number of cards offered)
            
            const offeredCardNames = [];
            for (const offer of listingOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                offeredCardNames.push(card.card_name);
            }
            
            const requestedCardNames = [];
            for (const cardId of cardInstanceIds) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [cardId]);
                requestedCardNames.push(card.card_name);
            }
            
            // Calculate total value of each side
            let offeredTotalValue = 0;
            for (const cardName of offeredCardNames) {
                const value = await get('SELECT current_market_value FROM card_market_values WHERE card_name = ?', [cardName]);
                offeredTotalValue += value?.current_market_value || 0;
            }
            
            let requestedTotalValue = 0;
            for (const cardName of requestedCardNames) {
                const value = await get('SELECT current_market_value FROM card_market_values WHERE card_name = ?', [cardName]);
                requestedTotalValue += value?.current_market_value || 0;
            }
            
            // Record events for offered cards (valued at what they received)
            const uniqueOffered = [...new Set(offeredCardNames)];
            for (const cardName of uniqueOffered) {
                const count = offeredCardNames.filter(c => c === cardName).length;
                const valuePerCard = Math.ceil(requestedTotalValue / offeredCardNames.length);
                
                await run(`
                    INSERT INTO market_events (card_name, event_type, event_value, metadata)
                    VALUES (?, 'trade', ?, ?)
                `, [cardName, valuePerCard, JSON.stringify({ trade_id: tradeId })]);
            }
            
            // Record events for requested cards (valued at what they cost)
            const uniqueRequested = [...new Set(requestedCardNames)];
            for (const cardName of uniqueRequested) {
                const count = requestedCardNames.filter(c => c === cardName).length;
                const valuePerCard = Math.ceil(offeredTotalValue / requestedCardNames.length);
                
                await run(`
                    INSERT INTO market_events (card_name, event_type, event_value, metadata)
                    VALUES (?, 'trade', ?, ?)
                `, [cardName, valuePerCard, JSON.stringify({ trade_id: tradeId })]);
            }

            // Update market values
            for (const cardName of allCardNames) {
                await updateMarketValue(cardName);
            }

            // Notify poster
            const accepterUsername = await get('SELECT username FROM users WHERE id = ?', [userId]);
            await createNotification(
                listing.posted_by_user_id,
                'trade_accepted',
                listingId,
                `${accepterUsername.username} accepted your trade offer!`
            );

            await commit();

            console.log(`✅ Trade completed: listing ${listingId}`);

            res.json({
                success: true,
                trade_id: tradeId
            });

        } catch (error) {
            await rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error accepting listing:', error);
        res.status(500).json({ error: 'Failed to accept listing' });
    }
});

// Create counter-offer
router.post('/counter-offer/:listingId', async (req, res) => {
    try {
        const userId = req.userId;
        const listingId = parseInt(req.params.listingId);
        const { cardInstanceIds } = req.body;

        // Get listing
        const listing = await get(`
            SELECT * FROM trade_listings
            WHERE id = ? AND status = 'open'
        `, [listingId]);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found or completed' });
        }

        if (listing.posted_by_user_id === userId) {
            return res.status(400).json({ error: 'Cannot counter your own listing' });
        }

        // Verify ownership
        for (const cardId of cardInstanceIds) {
            const card = await get(
                'SELECT user_id FROM card_instances WHERE id = ?',
                [cardId]
            );

            if (!card || card.user_id !== userId) {
                return res.status(403).json({ error: 'You do not own all offered cards' });
            }
        }

        // Create counter-offer
        const result = await run(`
            INSERT INTO trade_responses (listing_id, responder_user_id, status)
            VALUES (?, ?, 'pending')
        `, [listingId, userId]);

        const responseId = result.id;

        // Add offered cards
        for (const cardId of cardInstanceIds) {
            await run(`
                INSERT INTO trade_response_offers (response_id, card_instance_id)
                VALUES (?, ?)
            `, [responseId, cardId]);
        }

        // Notify listing owner
        const responderUsername = await get('SELECT username FROM users WHERE id = ?', [userId]);
        await createNotification(
            listing.posted_by_user_id,
            'trade_response',
            responseId,
            `${responderUsername.username} made a counter-offer on your listing`
        );

        console.log(`💬 Counter-offer ${responseId} created for listing ${listingId}`);

        res.json({
            success: true,
            response_id: responseId
        });

    } catch (error) {
        console.error('Error creating counter-offer:', error);
        res.status(500).json({ error: 'Failed to create counter-offer' });
    }
});

// Accept counter-offer
router.post('/accept-counter/:responseId', async (req, res) => {
    try {
        const userId = req.userId;
        const responseId = parseInt(req.params.responseId);

        await beginTransaction();

        try {
            // Get counter-offer
            const response = await get(`
                SELECT tr.*, tl.posted_by_user_id
                FROM trade_responses tr
                JOIN trade_listings tl ON tr.listing_id = tl.id
                WHERE tr.id = ? AND tr.status = 'pending'
            `, [responseId]);

            if (!response) {
                await rollback();
                return res.status(404).json({ error: 'Counter-offer not found' });
            }

            // Verify you own the listing
            if (response.posted_by_user_id !== userId) {
                await rollback();
                return res.status(403).json({ error: 'Not your listing' });
            }

            // Get original listing offers
            const listingOffers = await all(`
                SELECT card_instance_id
                FROM trade_listing_offers
                WHERE listing_id = ?
            `, [response.listing_id]);

            // Verify you still own them
            for (const offer of listingOffers) {
                const card = await get(
                    'SELECT user_id FROM card_instances WHERE id = ?',
                    [offer.card_instance_id]
                );

                if (!card || card.user_id !== userId) {
                    await rollback();
                    return res.status(400).json({ error: 'You no longer own offered cards' });
                }
            }

            // Get counter-offer cards
            const counterOffers = await all(`
                SELECT card_instance_id
                FROM trade_response_offers
                WHERE response_id = ?
            `, [responseId]);

            // Verify responder still owns them
            for (const offer of counterOffers) {
                const card = await get(
                    'SELECT user_id FROM card_instances WHERE id = ?',
                    [offer.card_instance_id]
                );

                if (!card || card.user_id !== response.responder_user_id) {
                    await rollback();
                    return res.status(400).json({ error: 'Responder no longer owns offered cards' });
                }
            }

            // EXECUTE TRADE
            // Transfer listing cards to responder
            for (const offer of listingOffers) {
                await run(`
                    UPDATE card_instances
                    SET user_id = ?
                    WHERE id = ?
                `, [response.responder_user_id, offer.card_instance_id]);
            }

            // Transfer counter-offer cards to you
            for (const offer of counterOffers) {
                await run(`
                    UPDATE card_instances
                    SET user_id = ?
                    WHERE id = ?
                `, [userId, offer.card_instance_id]);
            }

            // Mark response as accepted
            await run(`
                UPDATE trade_responses
                SET status = 'accepted'
                WHERE id = ?
            `, [responseId]);

            // Mark listing as completed
            await run(`
                UPDATE trade_listings
                SET status = 'completed'
                WHERE id = ?
            `, [response.listing_id]);

            // Record in trade history
            const tradeResult = await run(`
                INSERT INTO completed_trades (listing_id, response_id, user1_id, user2_id)
                VALUES (?, ?, ?, ?)
            `, [response.listing_id, responseId, userId, response.responder_user_id]);

            const tradeId = tradeResult.id;

            // Record items traded
            for (const offer of listingOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                await run(`
                    INSERT INTO trade_history_items (trade_id, from_user_id, to_user_id, card_instance_id, card_name)
                    VALUES (?, ?, ?, ?, ?)
                `, [tradeId, userId, response.responder_user_id, offer.card_instance_id, card.card_name]);
            }

            for (const offer of counterOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                await run(`
                    INSERT INTO trade_history_items (trade_id, from_user_id, to_user_id, card_instance_id, card_name)
                    VALUES (?, ?, ?, ?, ?)
                `, [tradeId, response.responder_user_id, userId, offer.card_instance_id, card.card_name]);
            }

            // Record market events for all cards traded
            const allCardNames = new Set();
            
            // Get listing cards with their names
            const listingCardNames = [];
            for (const offer of listingOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                listingCardNames.push(card.card_name);
                allCardNames.add(card.card_name);
            }
            
            // Get counter-offer cards with their names
            const counterCardNames = [];
            for (const offer of counterOffers) {
                const card = await get('SELECT card_name FROM card_instances WHERE id = ?', [offer.card_instance_id]);
                counterCardNames.push(card.card_name);
                allCardNames.add(card.card_name);
            }
            
            // Calculate total value of each side
            let listingTotalValue = 0;
            for (const cardName of listingCardNames) {
                const value = await get('SELECT current_market_value FROM card_market_values WHERE card_name = ?', [cardName]);
                listingTotalValue += value?.current_market_value || 0;
            }
            
            let counterTotalValue = 0;
            for (const cardName of counterCardNames) {
                const value = await get('SELECT current_market_value FROM card_market_values WHERE card_name = ?', [cardName]);
                counterTotalValue += value?.current_market_value || 0;
            }
            
            // Record events for listing cards (valued at what they received)
            const uniqueListing = [...new Set(listingCardNames)];
            for (const cardName of uniqueListing) {
                const valuePerCard = Math.ceil(counterTotalValue / listingCardNames.length);
                
                await run(`
                    INSERT INTO market_events (card_name, event_type, event_value, metadata)
                    VALUES (?, 'trade', ?, ?)
                `, [cardName, valuePerCard, JSON.stringify({ trade_id: tradeId })]);
            }
            
            // Record events for counter-offer cards (valued at what they cost)
            const uniqueCounter = [...new Set(counterCardNames)];
            for (const cardName of uniqueCounter) {
                const valuePerCard = Math.ceil(listingTotalValue / counterCardNames.length);
                
                await run(`
                    INSERT INTO market_events (card_name, event_type, event_value, metadata)
                    VALUES (?, 'trade', ?, ?)
                `, [cardName, valuePerCard, JSON.stringify({ trade_id: tradeId })]);
            }

            // Update market values
            for (const cardName of allCardNames) {
                await updateMarketValue(cardName);
            }

            // Notify responder
            await createNotification(
                response.responder_user_id,
                'trade_accepted',
                responseId,
                'Your counter-offer was accepted!'
            );

            await commit();

            console.log(`✅ Counter-offer ${responseId} accepted`);

            res.json({
                success: true,
                trade_id: tradeId
            });

        } catch (error) {
            await rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error accepting counter-offer:', error);
        res.status(500).json({ error: 'Failed to accept counter-offer' });
    }
});

// Reject counter-offer
router.post('/reject-counter/:responseId', async (req, res) => {
    try {
        const userId = req.userId;
        const responseId = parseInt(req.params.responseId);

        const response = await get(`
            SELECT tr.*, tl.posted_by_user_id
            FROM trade_responses tr
            JOIN trade_listings tl ON tr.listing_id = tl.id
            WHERE tr.id = ? AND tr.status = 'pending'
        `, [responseId]);

        if (!response) {
            return res.status(404).json({ error: 'Counter-offer not found' });
        }

        if (response.posted_by_user_id !== userId) {
            return res.status(403).json({ error: 'Not your listing' });
        }

        await run(`
            UPDATE trade_responses
            SET status = 'rejected'
            WHERE id = ?
        `, [responseId]);

        // Notify responder
        await createNotification(
            response.responder_user_id,
            'trade_rejected',
            responseId,
            'Your counter-offer was declined'
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Error rejecting counter-offer:', error);
        res.status(500).json({ error: 'Failed to reject counter-offer' });
    }
});

// Cancel my listing
router.delete('/cancel-listing/:id', async (req, res) => {
    try {
        const userId = req.userId;
        const listingId = parseInt(req.params.id);

        const listing = await get(`
            SELECT * FROM trade_listings
            WHERE id = ? AND posted_by_user_id = ? AND status = 'open'
        `, [listingId, userId]);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found or already completed' });
        }

        await run(`
            UPDATE trade_listings
            SET status = 'cancelled'
            WHERE id = ?
        `, [listingId]);

        // Notify anyone who made counter-offers
        const responders = await all(`
            SELECT DISTINCT responder_user_id
            FROM trade_responses
            WHERE listing_id = ? AND status = 'pending'
        `, [listingId]);

        for (const responder of responders) {
            await createNotification(
                responder.responder_user_id,
                'trade_cancelled',
                listingId,
                'A trade listing you responded to was cancelled'
            );
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Error cancelling listing:', error);
        res.status(500).json({ error: 'Failed to cancel listing' });
    }
});

// Get trade history
router.get('/history', async (req, res) => {
    try {
        const userId = req.userId;

        const trades = await all(`
            SELECT 
                ct.id,
                ct.completed_at,
                ct.user1_id,
                ct.user2_id,
                u1.username as user1_name,
                u2.username as user2_name
            FROM completed_trades ct
            JOIN users u1 ON ct.user1_id = u1.id
            JOIN users u2 ON ct.user2_id = u2.id
            WHERE ct.user1_id = ? OR ct.user2_id = ?
            ORDER BY ct.completed_at DESC
            LIMIT 50
        `, [userId, userId]);

        for (const trade of trades) {
            const items = await all(`
                SELECT 
                    card_name,
                    from_user_id,
                    to_user_id
                FROM trade_history_items
                WHERE trade_id = ?
            `, [trade.id]);

            trade.items_sent = items.filter(i => i.from_user_id === userId);
            trade.items_received = items.filter(i => i.to_user_id === userId);
        }

        res.json({ trades });

    } catch (error) {
        console.error('Error fetching trade history:', error);
        res.status(500).json({ error: 'Failed to fetch trade history' });
    }
});

// Get market values
router.get('/market-values', async (req, res) => {
  try {
        // Initialize market values if empty (first time)
        console.log('[Market] Checking if market values need seeding...');
        const count = await get('SELECT COUNT(*) as count FROM card_market_values');
        console.log('[Market] Current market value count:', count);
        
        if (!count || parseInt(count.count) === 0) {
            console.log('[Market] Table empty! Seeding initial market values...');
            const ALL_CARDS = require('./cards-data').ALL_CARDS;
            const CARD_PRICES = require('./cards-data').CARD_PRICES;
            
            for (const card of ALL_CARDS) {
                if (card.variant !== 'Full Art') {
                    const basePrice = CARD_PRICES[card.rarity] || 50;
                    await run(
                        'INSERT INTO card_market_values (card_name, base_price, current_market_value, trade_count_30d) VALUES (?, ?, ?, 0)',
                        [card.name, basePrice, basePrice]
                    );
                }
            }
            console.log('[Market] Seeded market values for all cards!');
        } else {
            console.log('[Market] Market values already exist, count:', count ? count.count : 'null');
        }

    } catch (error) {
        console.error('Error fetching market values:', error);
        res.status(500).json({ error: 'Failed to fetch market values' });
    }
});

// Sell card to store (25% refund, card goes to used market)
router.post('/sell-card', async (req, res) => {
    try {
        const userId = req.userId;
        const { cardInstanceId } = req.body;

        // Get card with current market value
        const card = await get(`
            SELECT ci.*, cmv.current_market_value
            FROM card_instances ci
            JOIN card_market_values cmv ON ci.card_name = cmv.card_name
            WHERE ci.id = ?
        `, [cardInstanceId]);

        if (!card || card.user_id !== userId) {
            return res.status(403).json({ error: 'Card not found or not owned' });
        }

        const marketValue = card.current_market_value;
        
        // Seller gets 25% of market value
        const sellPrice = Math.floor(marketValue * 0.25);
        
        // Store will list for 85% of market value
        const baseListPrice = Math.floor(marketValue * 0.85);

        // Transfer card to store (user_id = 0)
        await run(`
            UPDATE card_instances
            SET user_id = 0
            WHERE id = ?
        `, [cardInstanceId]);

        // Add to used cards inventory
        await run(`
            INSERT INTO store_used_cards 
            (card_instance_id, card_name, original_owner_id, art_variant, sell_price, base_list_price)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [cardInstanceId, card.card_name, userId, card.art_variant || 'standard', sellPrice, baseListPrice]);

        // Add gold to player
        await run(`
            UPDATE player_data
            SET gold = gold + ?
            WHERE user_id = ?
        `, [sellPrice, userId]);

        // Log transaction
        await run(`
            INSERT INTO transactions (user_id, type, amount, currency, reason)
            VALUES (?, 'earn', ?, 'gold', ?)
        `, [userId, sellPrice, `sold_${card.card_name}_to_store`]);

        // Record market event
        // Use 80% of sell price as market signal (since player got 25%, implies card worth 100%)
        const marketEventValue = Math.ceil(sellPrice / 0.25);
        
        await run(`
            INSERT INTO market_events (card_name, event_type, event_value, metadata)
            VALUES (?, 'store_sale', ?, ?)
        `, [card.card_name, marketEventValue, JSON.stringify({ card_instance_id: cardInstanceId, sell_price: sellPrice })]);

        // Update market value
        await updateMarketValue(card.card_name);

        console.log(`💰 User ${userId} sold ${card.card_name} to store for ${sellPrice}g`);

        // Get updated gold
        const playerData = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            gold_earned: sellPrice,
            new_gold: playerData.gold,
            card_name: card.card_name
        });

    } catch (error) {
        console.error('Error selling card to store:', error);
        res.status(500).json({ error: 'Failed to sell card' });
    }
});

// Get notifications
router.get('/notifications', async (req, res) => {
    try {
        const userId = req.userId;

        const notifications = await all(`
            SELECT *
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        `, [userId]);

        res.json({ notifications });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.post('/notifications/:id/read', async (req, res) => {
    try {
        const userId = req.userId;
        const notificationId = parseInt(req.params.id);

        await run(`
            UPDATE notifications
            SET is_read = 1
            WHERE id = ? AND user_id = ?
        `, [notificationId, userId]);

        res.json({ success: true });

    } catch (error) {
        console.error('Error marking notification:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Export for other modules
router.updateMarketValue = updateMarketValue;

module.exports = router;
