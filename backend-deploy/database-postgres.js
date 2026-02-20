// PostgreSQL Database Connection for Render + Supabase
const { Pool } = require('pg');

// Database connection using environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log('🔌 Connecting to PostgreSQL database...');

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Connected to PostgreSQL database');
    }
});

// Initialize database schema
async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('📋 Initializing database schema...');
        
        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        `);

        // Player data table
        await client.query(`
            CREATE TABLE IF NOT EXISTS player_data (
                user_id INTEGER PRIMARY KEY,
                gold INTEGER DEFAULT 500,
                gems INTEGER DEFAULT 5,
                last_daily_reward TIMESTAMP,
                last_store_refresh TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Owned cards table (legacy v2.x compatibility)
        await client.query(`
            CREATE TABLE IF NOT EXISTS owned_cards (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                card_name TEXT NOT NULL,
                count INTEGER DEFAULT 1,
                acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, card_name)
            )
        `);

        // Card instances table (v3.0 - individual card tracking)
        await client.query(`
            CREATE TABLE IF NOT EXISTS card_instances (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                card_name TEXT NOT NULL,
                art_variant TEXT DEFAULT 'standard',
                acquired_from TEXT,
                acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Store rotation table
        await client.query(`
            CREATE TABLE IF NOT EXISTS store_rotation (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                card_name TEXT NOT NULL,
                rotation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Game statistics table
        await client.query(`
            CREATE TABLE IF NOT EXISTS game_stats (
                user_id INTEGER PRIMARY KEY,
                total_games INTEGER DEFAULT 0,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                win_streak INTEGER DEFAULT 0,
                loss_streak INTEGER DEFAULT 0,
                best_win_streak INTEGER DEFAULT 0,
                worst_loss_streak INTEGER DEFAULT 0,
                total_damage_dealt INTEGER DEFAULT 0,
                total_damage_taken INTEGER DEFAULT 0,
                total_cards_played INTEGER DEFAULT 0,
                total_mana_spent INTEGER DEFAULT 0,
                average_game_length INTEGER DEFAULT 0,
                quickest_win INTEGER DEFAULT 999,
                longest_game INTEGER DEFAULT 0,
                difficulty_level TEXT DEFAULT 'beginner',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Transactions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                amount INTEGER NOT NULL,
                currency TEXT NOT NULL,
                before_balance INTEGER,
                after_balance INTEGER,
                reason TEXT,
                ip_address TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Trading listings table
        await client.query(`
            CREATE TABLE IF NOT EXISTS trading_listings (
                id SERIAL PRIMARY KEY,
                seller_id INTEGER NOT NULL,
                card_instance_id TEXT NOT NULL,
                asking_price INTEGER NOT NULL,
                listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active',
                FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (card_instance_id) REFERENCES card_instances(id) ON DELETE CASCADE
            )
        `);

        // Trading offers table
        await client.query(`
            CREATE TABLE IF NOT EXISTS trading_offers (
                id SERIAL PRIMARY KEY,
                listing_id INTEGER NOT NULL,
                buyer_id INTEGER NOT NULL,
                offer_type TEXT NOT NULL,
                offer_amount INTEGER,
                offered_card_instance_id TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (listing_id) REFERENCES trading_listings(id) ON DELETE CASCADE,
                FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Market events table
        await client.query(`
            CREATE TABLE IF NOT EXISTS market_events (
                id SERIAL PRIMARY KEY,
                card_name TEXT NOT NULL,
                event_type TEXT NOT NULL,
                event_value INTEGER NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

// Card market values table (for trading)
        await client.query(`
            CREATE TABLE IF NOT EXISTS card_market_values (
                card_name TEXT PRIMARY KEY,
                base_price INTEGER NOT NULL,
                current_market_value INTEGER NOT NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Used cards in store
        await client.query(`
            CREATE TABLE IF NOT EXISTS store_used_cards (
                id SERIAL PRIMARY KEY,
                card_instance_id TEXT NOT NULL,
                card_name TEXT NOT NULL,
                art_variant TEXT DEFAULT 'standard',
                base_list_price INTEGER NOT NULL,
                listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (card_instance_id) REFERENCES card_instances(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Database schema initialized');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Helper functions for database operations
const dbHelpers = {
    // Run a query (INSERT/UPDATE/DELETE)
    run: async (sql, params = []) => {
        // Convert ? placeholders to $1, $2, etc.
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        const result = await pool.query(pgSql, params);
        
        // If RETURNING was used, return the row, otherwise return metadata
        if (result.rows && result.rows.length > 0) {
            return result.rows[0]; // Return the row with RETURNING data
        }
        
        return { 
            changes: result.rowCount 
        };
    },

    // Get a single row
    get: async (sql, params = []) => {
        // Convert ? placeholders to $1, $2, etc.
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        const result = await pool.query(pgSql, params);
        return result.rows[0] || null;
    },

    // Get multiple rows
    all: async (sql, params = []) => {
        // Convert ? placeholders to $1, $2, etc.
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        const result = await pool.query(pgSql, params);
        return result.rows;
    },

    // Begin transaction
    beginTransaction: async () => {
        const client = await pool.connect();
        await client.query('BEGIN');
        return client;
    },

    // Commit transaction
    commit: async (client) => {
        await client.query('COMMIT');
        client.release();
    },

    // Rollback transaction
    rollback: async (client) => {
        await client.query('ROLLBACK');
        client.release();
    }
};

module.exports = {
    pool,
    initializeDatabase,
    ...dbHelpers
};
