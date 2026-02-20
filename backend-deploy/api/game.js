const express = require('express');
const router = express.Router();
const { get, run, all } = require('../database-postgres');
const { verifyToken } = require('../auth');

router.use(verifyToken);

// v3.0: Validate deck color rules
function validateDeckColors(deck) {
    // RULE 1: Exactly 30 cards
    if (deck.length !== 30) {
        return { valid: false, error: 'Deck must have exactly 30 cards' };
    }
    
    // Count main colors and splash cards
    let mainColors = new Set();
    let splashCards = [];
    let cardCount = {};
    
    deck.forEach(card => {
        // Track card counts (max 2 regular, max 1 legendary)
        if (!cardCount[card.name]) cardCount[card.name] = 0;
        cardCount[card.name]++;
        
        if (card.rarity === 'legendary' && cardCount[card.name] > 1) {
            return { valid: false, error: `Too many copies of legendary ${card.name}` };
        }
        if (card.rarity !== 'legendary' && cardCount[card.name] > 2) {
            return { valid: false, error: `Too many copies of ${card.name} (max 2)` };
        }
        
        // Skip colorless and The Nexus (counts as colorless for deck building)
        if (card.color && card.color.includes('colorless')) return;
        
        // Categorize by splash vs main
        if (card.splashFriendly) {
            splashCards.push(card);
        } else {
            const colors = (card.color || '').split('-');
            colors.forEach(c => mainColors.add(c));
        }
    });
    
    // RULE 2: Max 2 main colors
    if (mainColors.size > 2) {
        return { 
            valid: false, 
            error: `Too many colors: ${Array.from(mainColors).join(', ')}. Max 2 allowed.` 
        };
    }
    
    // RULE 3: Max 3 splash cards
    if (splashCards.length > 3) {
        return { valid: false, error: `Too many splash cards (${splashCards.length}). Max 3 allowed.` };
    }
    
    // RULE 4: Splash cards must be 3rd color
    for (let card of splashCards) {
        if (mainColors.has(card.color)) {
            return { 
                valid: false, 
                error: `${card.name} cannot be splash - it's a main color` 
            };
        }
    }
    
    return { valid: true };
}

// Record game result
router.post('/complete', async (req, res) => {
    try {
        const userId = req.userId;
        const { won, gameData } = req.body;

        // Validate input
        if (typeof won !== 'boolean') {
            return res.status(400).json({ error: 'Invalid game result' });
        }

        // Get current stats
        let stats = await get(
            'SELECT * FROM game_stats WHERE user_id = ?',
            [userId]
        );

        if (!stats) {
            // Initialize stats if not exists
            await run(
                'INSERT INTO game_stats (user_id) VALUES (?)',
                [userId]
            );
            const newStats = await get(
                'SELECT * FROM game_stats WHERE user_id = ?',
                [userId]
            );
            stats = newStats;
        }

        // Update game stats
        const totalGames = (stats.total_games || 0) + 1;
        const wins = won ? (stats.wins || 0) + 1 : (stats.wins || 0);
        const losses = won ? (stats.losses || 0) : (stats.losses || 0) + 1;
        const winStreak = won ? (stats.win_streak || 0) + 1 : 0;
        const lossStreak = won ? 0 : (stats.loss_streak || 0) + 1;
        const bestWinStreak = Math.max(winStreak, stats.best_win_streak || 0);
        const worstLossStreak = Math.max(lossStreak, stats.worst_loss_streak || 0);

        // Calculate difficulty level based on performance
        const overallWinRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
        let difficultyLevel = 'beginner';
        
        if (totalGames <= 3) {
            // First 3 games are always beginner
            difficultyLevel = 'beginner';
        } else {
            // Games 4+ use win rate and streak system
            if (winStreak >= 5 || overallWinRate >= 80) {
                difficultyLevel = 'expert';
            } else if (winStreak >= 3 || overallWinRate >= 70) {
                difficultyLevel = 'hard';
            } else if (overallWinRate >= 60) {
                difficultyLevel = 'normal';
            } else if (overallWinRate >= 40) {
                difficultyLevel = 'easy';
            } else {
                difficultyLevel = 'beginner';
            }
            
            // Safety net: If losing too much, force easier difficulty
            if (lossStreak >= 4) {
                difficultyLevel = 'beginner';
            } else if (lossStreak >= 2 && difficultyLevel !== 'beginner') {
                const levels = ['beginner', 'easy', 'normal', 'hard', 'expert'];
                const currentIndex = levels.indexOf(difficultyLevel);
                if (currentIndex > 0) {
                    difficultyLevel = levels[currentIndex - 1];
                }
            }
        }

        console.log(`[DIFFICULTY] User ${userId}: ${difficultyLevel} (${totalGames} games, ${overallWinRate.toFixed(1)}% win rate, ${winStreak}W/${lossStreak}L streak)`);

        await run(`
            UPDATE game_stats SET
                total_games = ?,
                wins = ?,
                losses = ?,
                win_streak = ?,
                loss_streak = ?,
                best_win_streak = ?,
                worst_loss_streak = ?,
                difficulty_level = ?,
                total_damage_dealt = total_damage_dealt + ?,
                total_damage_taken = total_damage_taken + ?,
                total_cards_played = total_cards_played + ?,
                total_mana_spent = total_mana_spent + ?
            WHERE user_id = ?
        `, [
            totalGames, wins, losses, winStreak, lossStreak,
            bestWinStreak, worstLossStreak, difficultyLevel,
            gameData?.damageDealt || 0,
            gameData?.damageTaken || 0,
            gameData?.cardsPlayed || 0,
            gameData?.manaSpent || 0,
            userId
        ]);

        // Calculate rewards
        let goldReward = 0;
        let gemsReward = 0;

        if (won) {
            goldReward = 50 + Math.floor(Math.random() * 30); // 50-80 gold
            
            // Bonus rewards for streaks
            if (winStreak >= 3) {
                goldReward += 25;
            }
            if (winStreak >= 5) {
                gemsReward = 1;
            }
        } else {
            // Loss consolation reward
            goldReward = 10;
        }

        // Give rewards
        await run(
            'UPDATE player_data SET gold = gold + ?, gems = gems + ? WHERE user_id = ?',
            [goldReward, gemsReward, userId]
        );

        // Log transaction
        await run(
            'INSERT INTO transactions (user_id, type, amount, currency, reason) VALUES (?, ?, ?, ?, ?)',
            [userId, 'earn', goldReward, 'gold', won ? 'game_victory' : 'game_participation']
        );

        if (gemsReward > 0) {
            await run(
                'INSERT INTO transactions (user_id, type, amount, currency, reason) VALUES (?, ?, ?, ?, ?)',
                [userId, 'earn', gemsReward, 'gems', 'win_streak_bonus']
            );
        }

        // Get updated player data
        const playerData = await get(
            'SELECT gold, gems FROM player_data WHERE user_id = ?',
            [userId]
        );

        // Get updated game stats
        const updatedStats = await get(
            'SELECT * FROM game_stats WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            won,
            goldReward,
            gemsReward,
            winStreak,
            newGold: playerData.gold,
            newGems: playerData.gems,
            gameStats: {
                totalGames: updatedStats.total_games,
                wins: updatedStats.wins,
                losses: updatedStats.losses,
                winStreak: updatedStats.win_streak,
                lossStreak: updatedStats.loss_streak,
                bestWinStreak: updatedStats.best_win_streak,
                worstLossStreak: updatedStats.worst_loss_streak,
                totalDamageDealt: updatedStats.total_damage_dealt,
                totalDamageTaken: updatedStats.total_damage_taken,
                totalCardsPlayed: updatedStats.total_cards_played,
                totalManaSpent: updatedStats.total_mana_spent,
                difficultyLevel: updatedStats.difficulty_level
            }
        });

    } catch (error) {
        console.error('Error recording game:', error);
        res.status(500).json({ error: 'Failed to record game result' });
    }
});

// Validate deck before multiplayer game
router.post('/validate-deck', async (req, res) => {
    try {
        const userId = req.userId;
        const { deck } = req.body;

        if (!Array.isArray(deck) || deck.length !== 30) {
            return res.status(400).json({ error: 'Deck must contain exactly 30 cards' });
        }
        
        // v3.0: Validate color rules FIRST
        const colorValidation = validateDeckColors(deck);
        if (!colorValidation.valid) {
            console.log(`[Deck Validation] Color rules failed for user ${userId}: ${colorValidation.error}`);
            return res.status(400).json({ error: colorValidation.error });
        }

        // Get player's owned cards
        const ownedCards = await all(
            'SELECT card_name, count FROM owned_cards WHERE user_id = ?',
            [userId]
        );

        const ownedCardsMap = {};
        ownedCards.forEach(card => {
            ownedCardsMap[card.card_name] = card.count;
        });

        // Verify player owns all cards in deck
        const cardCounts = {};
        for (const card of deck) {
            const cardName = card.name;
            cardCounts[cardName] = (cardCounts[cardName] || 0) + 1;

            if (!ownedCardsMap[cardName] || cardCounts[cardName] > ownedCardsMap[cardName]) {
                return res.status(403).json({ 
                    error: `You don't own enough copies of ${cardName}` 
                });
            }
        }

        res.json({ valid: true });

    } catch (error) {
        console.error('Error validating deck:', error);
        res.status(500).json({ error: 'Server error during validation' });
    }
});

// Reset game statistics endpoint
router.post('/reset-stats', async (req, res) => {
    try {
        const userId = req.userId;  // FIX: Use req.userId not req.user.userId
        
        console.log(`[RESET STATS] User ${userId} resetting statistics`);
        
        // Reset all stats to 0 in database
        run(`
            UPDATE game_stats SET
                total_games = 0,
                wins = 0,
                losses = 0,
                win_streak = 0,
                loss_streak = 0,
                best_win_streak = 0,
                worst_loss_streak = 0,
                difficulty_level = 'beginner',
                total_damage_dealt = 0,
                total_damage_taken = 0,
                total_cards_played = 0,
                total_mana_spent = 0
            WHERE user_id = ?
        `, [userId]);
        
        console.log(`[RESET STATS] User ${userId} statistics reset to 0 in database`);
        
        res.json({
            success: true,
            message: 'Statistics reset successfully'
        });
        
    } catch (error) {
        console.error('[RESET STATS] Error:', error);
        res.status(500).json({ error: 'Failed to reset statistics' });
    }
});

module.exports = router;
