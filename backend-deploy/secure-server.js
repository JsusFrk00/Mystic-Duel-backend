// Secure Mystic Duel Server v3.0.0
// Combines authentication, API routes, and multiplayer functionality

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// Import database and auth (PostgreSQL version)
const { initializeDatabase } = require('./database-postgres');
const { registerUser, loginUser, verifyToken } = require('./auth');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

// CORS configuration for Electron (file://) and web clients
app.use(cors({
    origin: '*', // Allow all origins (Electron uses file://)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize database
initializeDatabase().then(() => {
    console.log('✅ Database ready');
}).catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await registerUser(username, email, password);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// API routes
const playerRouter = require('./api/player');
const storeRouter = require('./api/store');
const gameRouter = require('./api/game');
const tradesRouter = require('./api/trades');
const migrationRouter = require('./api/migration');

app.use('/api/player', playerRouter);
app.use('/api/store', storeRouter);
app.use('/api/game', gameRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/migrate', migrationRouter);

// Migration endpoint moved to ./api/migration.js
// Now creates card_instances directly (v3.0+)

// Static file serving
const SRC_DIR = path.dirname(__dirname); // Mystic-Duel-Rebuild directory

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Serve static files
app.get('*', (req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query strings
    filePath = filePath.split('?')[0];
    
    const fullPath = path.join(SRC_DIR, filePath);
    const extname = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(fullPath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Try to serve index.html for client-side routing
                const indexPath = path.join(SRC_DIR, 'index.html');
                fs.readFile(indexPath, (indexError, indexContent) => {
                    if (indexError) {
                        res.status(404).send('File not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.status(500).send('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io for multiplayer (keeping existing multiplayer functionality)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Import existing multiplayer game state manager (if needed)
// For now, keeping multiplayer separate from auth to avoid complexity
// Players must be authenticated to play, but game rooms don't require JWT per message

io.on('connection', (socket) => {
    console.log('🌐 Player connected:', socket.id);
    
    socket.emit('connected', { 
        playerId: socket.id,
        message: 'Connected to Secure Mystic Duel server v3.0.0!' 
    });
    
    // Multiplayer handlers can stay the same
    // Authentication is handled at the API level
    
    socket.on('disconnect', () => {
        console.log('👋 Player disconnected:', socket.id);
    });
});

// Server configuration
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces for cloud hosting

// Start server
server.listen(PORT, HOST, () => {
    console.log('================================================');
    console.log('       🎴 MYSTIC DUEL - SECURE SERVER v3.0.0 🎴');
    console.log('================================================');
    console.log('✅ Server running at: http://' + HOST + ':' + PORT);
    console.log('🔒 Security Features:');
    console.log('   ✓ JWT Authentication');
    console.log('   ✓ Rate Limiting');
    console.log('   ✓ SQL Injection Protection');
    console.log('   ✓ Server-Authoritative Economy');
    console.log('   ✓ Transaction Logging');
    console.log('🌐 Multiplayer: ENABLED');
    console.log('📂 Serving files from: ' + SRC_DIR);
    console.log('================================================');
    console.log('💡 Press Ctrl+C to stop the server');
    console.log('================================================');
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('❌ Port ' + PORT + ' is already in use.');
        console.log('Try closing other applications or use a different port.');
    } else {
        console.error('❌ Server error:', err.message);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped.');
        process.exit(0);
    });
});

module.exports = { server, io };