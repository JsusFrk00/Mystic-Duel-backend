const express = require('express');
const router = express.Router();
const { get, run } = require('../database-postgres');
const { verifyToken } = require('../auth');
const crypto = require('crypto');

// Migration endpoint - converts localStorage → server database
// This now creates card_instances directly (v3.0+)
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { oldData } = req.body;

        // Verify this account hasn't already migrated
        const existing = await get(
            'SELECT gold FROM player_data WHERE user_id = ?',
            [userId]
        );

        if (existing && existing.gold > 500) {
            return res.status(400).json({ 
                error: 'Account already has data. Migration not needed.' 
            });
        }

        console.log(`[MIGRATION] Starting migration for user ${userId}`);

        // Update player data
        await run(
            'UPDATE player_data SET gold = ?, gems = ? WHERE user_id = ?',
            [oldData.gold || 500, oldData.gems || 5, userId]
        );

        console.log(`[MIGRATION] Updated gold: ${oldData.gold || 500}, gems: ${oldData.gems || 5}`);

        // Migrate owned cards → card_instances (v3.0: Direct to instances)
        if (oldData.ownedCards) {
            let totalInstances = 0;
            
            for (const [cardName, count] of Object.entries(oldData.ownedCards)) {
                // Create individual card instances for each card
                for (let i = 0; i < count; i++) {
                    const instanceId = `card_${crypto.randomBytes(16).toString('hex')}`;
                    
                    await run(`
                        INSERT INTO card_instances (id, user_id, card_name, acquired_from)
                        VALUES (?, ?, ?, 'migration')
                    `, [instanceId, userId, cardName]);
                    
                    totalInstances++;
                }

                // ALSO update owned_cards for backwards compatibility
                // (in case any old code still reads from this table)
                await run(
                    'INSERT OR REPLACE INTO owned_cards (user_id, card_name, count) VALUES (?, ?, ?)',
                    [userId, cardName, count]
                );
            }
            
            console.log(`[MIGRATION] Created ${totalInstances} card instances across ${Object.keys(oldData.ownedCards).length} card types`);
        }

        // Migrate game stats if available
        if (oldData.gameStats) {
            const stats = oldData.gameStats;
            await run(`
                UPDATE game_stats SET
                    total_games = ?,
                    wins = ?,
                    losses = ?,
                    win_streak = ?,
                    best_win_streak = ?
                WHERE user_id = ?
            `, [
                stats.totalGames || 0,
                stats.wins || 0,
                stats.losses || 0,
                stats.winStreak || 0,
                stats.bestWinStreak || 0,
                userId
            ]);
            console.log(`[MIGRATION] Migrated game stats: ${stats.totalGames || 0} games, ${stats.wins || 0} wins`);
        }

        console.log(`✅ Migration completed successfully for user ${userId}`);
        res.json({ 
            success: true,
            message: 'Your progress has been migrated to the secure server!'
        });

    } catch (error) {
        console.error(`❌ Migration error for user ${req.userId}:`, error);
        res.status(500).json({ 
            error: 'Migration failed: ' + error.message,
            details: 'Please contact support if this issue persists.'
        });
    }
});

module.exports = router;
