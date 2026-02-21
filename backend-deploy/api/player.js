const express = require('express');
const router = express.Router();
const { get, all, run } = require('../database-postgres');
const { verifyToken } = require('../auth');

// All routes require authentication
router.use(verifyToken);

// Get player data
router.get('/data', async (req, res) => {
    try {
        const userId = req.userId;

        // Get player data
        const playerData = await get(
            'SELECT gold, gems, last_daily_reward, last_store_refresh FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Get card instances with their IDs and variants
        const cardInstances = await all(
            'SELECT id, card_name, art_variant FROM card_instances WHERE user_id = ?',
            [userId]
        );

        // Group by card name for backward compatibility
        const ownedCardsObj = {};
        const cardInstancesById = {};
        
        cardInstances.forEach(card => {
            ownedCardsObj[card.card_name] = (ownedCardsObj[card.card_name] || 0) + 1;
            // v3.0: Store full instance data including variant
            cardInstancesById[card.id] = {
                name: card.card_name,
                variant: card.art_variant || 'standard'
            };
        });

        // Get game stats
        const gameStats = await get(
            'SELECT * FROM game_stats WHERE user_id = ?',
            [userId]
        );

        // Convert game stats from database format to frontend format
        const formattedGameStats = gameStats ? {
            totalGames: gameStats.total_games || 0,
            wins: gameStats.wins || 0,
            losses: gameStats.losses || 0,
            winStreak: gameStats.win_streak || 0,
            lossStreak: gameStats.loss_streak || 0,
            bestWinStreak: gameStats.best_win_streak || 0,
            worstLossStreak: gameStats.worst_loss_streak || 0,
            totalDamageDealt: gameStats.total_damage_dealt || 0,
            totalDamageTaken: gameStats.total_damage_taken || 0,
            totalCardsPlayed: gameStats.total_cards_played || 0,
            totalManaSpent: gameStats.total_mana_spent || 0,
            averageGameLength: gameStats.average_game_length || 0,
            quickestWin: gameStats.quickest_win || 999,
            longestGame: gameStats.longest_game || 0,
            difficultyLevel: gameStats.difficulty_level || 'beginner'
        } : {};

        // Get store rotation (PostgreSQL syntax)
        const storeCards = await all(
            'SELECT card_name FROM store_rotation WHERE user_id = ? AND DATE(rotation_date) = CURRENT_DATE',
            [userId]
        );

        res.json({
            gold: playerData ? playerData.gold : 500,
            gems: playerData ? playerData.gems : 5,
            ownedCards: ownedCardsObj,
            cardInstances: cardInstancesById,  // NEW: card instances for trading
            lastDailyReward: playerData?.last_daily_reward,
            lastStoreRefresh: playerData?.last_store_refresh,
            currentStoreCards: storeCards.map(c => c.card_name),
            gameStats: formattedGameStats
        });
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

// Claim daily reward
router.post('/daily-reward', async (req, res) => {
    try {
        const userId = req.userId;

        // Get last claim time
        const playerData = await get(
            'SELECT gold, gems, last_daily_reward FROM player_data WHERE user_id = ?',
            [userId]
        );

        const now = new Date();
        const lastClaim = playerData.last_daily_reward ? new Date(playerData.last_daily_reward) : null;
        
        // Check if midnight UTC-4 has passed since last claim
        if (lastClaim) {
            const utcOffset = -4; // UTC-4
            const nowUTC4 = new Date(now.getTime() + (utcOffset * 60 * 60 * 1000));
            const lastClaimUTC4 = new Date(lastClaim.getTime() + (utcOffset * 60 * 60 * 1000));
            
            // Get midnight of today and last claim day in UTC-4
            const todayMidnight = new Date(nowUTC4);
            todayMidnight.setHours(0, 0, 0, 0);
            const lastClaimMidnight = new Date(lastClaimUTC4);
            lastClaimMidnight.setHours(0, 0, 0, 0);
            
            // If we haven't crossed midnight, can't claim yet
            if (todayMidnight <= lastClaimMidnight) {
                // Calculate hours until next midnight UTC-4
                const nextMidnight = new Date(nowUTC4);
                nextMidnight.setHours(24, 0, 0, 0);
                const nextMidnightLocal = new Date(nextMidnight.getTime() - (utcOffset * 60 * 60 * 1000));
                const hoursLeft = Math.ceil((nextMidnightLocal - now) / (60 * 60 * 1000));
                
                return res.status(400).json({ 
                    error: `Daily reward already claimed. Try again in ${hoursLeft} hours.` 
                });
            }
        }

        // Grant reward
        const goldReward = 100;
        const gemsReward = 1;
        const newGold = playerData.gold + goldReward;
        const newGems = playerData.gems + gemsReward;

        await run(
            'UPDATE player_data SET gold = ?, gems = ?, last_daily_reward = CURRENT_TIMESTAMP WHERE user_id = ?',
            [newGold, newGems, userId]
        );

        // Log transaction
        await run(
            'INSERT INTO transactions (user_id, type, amount, currency, before_balance, after_balance, reason, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, 'earn', goldReward, 'gold', playerData.gold, newGold, 'daily_reward', req.ip]
        );

        console.log(`💰 Daily reward claimed by user ${userId}`);

        res.json({
            success: true,
            goldReward,
            gemsReward,
            newGold,
            newGems
        });
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        res.status(500).json({ error: 'Failed to claim daily reward' });
    }
});

module.exports = router;