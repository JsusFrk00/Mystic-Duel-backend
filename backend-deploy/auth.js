const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get } = require('./database-postgres');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'mystic-duel-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Register new user
async function registerUser(username, email, password) {
    try {
        // Validate input
        if (!username || username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }
        
        // Email is now optional - use username@game.local if not provided
        if (!email || email.trim() === '') {
            email = `${username.toLowerCase()}@game.local`;
        } else if (!email.includes('@')) {
            throw new Error('Invalid email address');
        }
        
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if user already exists
        const existingUser = await get(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user (PostgreSQL returns row with RETURNING)
        const result = await run(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING id',
            [username, email, passwordHash]
        );

        const userId = result.id;

        // Initialize player data with starter cards
        await run(
            'INSERT INTO player_data (user_id, gold, gems) VALUES (?, 500, 5)',
            [userId]
        );

        // Initialize game stats
        await run(
            'INSERT INTO game_stats (user_id) VALUES (?)',
            [userId]
        );

        // Give starter cards
        const starterCards = [
            "Goblin Scout", "Goblin Scout", 
            "Fire Sprite", "Fire Sprite",
            "Shield Bearer", "Shield Bearer",
            "Forest Wolf", "Forest Wolf",
            "Apprentice Mage", "Apprentice Mage",
            "Skeleton Warrior", "Skeleton Warrior",
            "Peasant", "Peasant", "Squire",
            "Arcane Missile", "Arcane Missile",
            "Healing Touch", "Healing Touch",
            "Frost Bolt", "Frost Bolt",
            "Battle Cry", "Battle Cry",
            "Minor Blessing", "Minor Blessing",
            "Mystic Owl", "Stone Golem", "Lightning Bolt", 
            "Healing Potion", "Wind Dancer"
        ];

        // Count occurrences of each card
        const cardCounts = {};
        starterCards.forEach(card => {
            cardCounts[card] = (cardCounts[card] || 0) + 1;
        });

        // Insert owned cards (legacy v2.x table)
        for (const [cardName, count] of Object.entries(cardCounts)) {
            await run(
                'INSERT INTO owned_cards (user_id, card_name, count) VALUES (?, ?, ?)',
                [userId, cardName, count]
            );
        }
        
        // Create card instances (v3.0 - one row per card)
        const { v4: uuidv4 } = require('uuid');
        for (const cardName of starterCards) {
            const instanceId = 'card_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            await run(
                'INSERT INTO card_instances (id, user_id, card_name, art_variant, acquired_from) VALUES (?, ?, ?, ?, ?)',
                [instanceId, userId, cardName, 'standard', 'starter']
            );
        }

        console.log(`✅ User registered: ${username} (ID: ${userId}) with email: ${email}`);
        
        return { userId, username, email };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login user
async function loginUser(username, password) {
    try {
        // Find user
        const user = await get(
            'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (!user) {
            throw new Error('Invalid username or password');
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            throw new Error('Invalid username or password');
        }

        // Update last login
        await run(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`✅ User logged in: ${user.username}`);

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Verify JWT token (middleware)
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    });
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken
};
