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

// Matchmaking queue and active games
const matchmakingQueue = [];
const activeGames = new Map(); // gameId -> {player1, player2, gameState}

io.on('connection', (socket) => {
    console.log('🌐 Player connected:', socket.id);
    console.log('   [VERSION: v3.2-MULTIPLAYER-FIX-2025-02-25]'); // Version marker
    
    socket.emit('connected', { 
        playerId: socket.id,
        message: 'Connected to Secure Mystic Duel server v3.2!' 
    });
    
    // Matchmaking
    socket.on('findMatch', () => {
        console.log('🔍 Player looking for match:', socket.id);
        
        // Check if already in queue
        if (matchmakingQueue.includes(socket.id)) {
            console.log('  Already in queue');
            return;
        }
        
        // Try to find an opponent
        if (matchmakingQueue.length > 0) {
            const opponentId = matchmakingQueue.shift();
            const opponent = io.sockets.sockets.get(opponentId);
            
            if (opponent) {
                // Match found!
                const gameId = socket.id + '-' + opponentId;
                console.log('✅ Match found! Creating game:', gameId);
                
                // Create game room
                socket.join(gameId);
                opponent.join(gameId);
                
                // Initialize game state
                activeGames.set(gameId, {
                    player1: { id: socket.id, socket: socket, ready: false, deck: null },
                    player2: { id: opponentId, socket: opponent, ready: false, deck: null },
                    currentTurn: socket.id,
                    gameState: {}
                });
                
                console.log('  Initialized game with both players ready: false');
                
                // Notify both players
                socket.emit('matchFound', { 
                    gameId: gameId,
                    opponentId: opponentId,
                    yourTurn: true
                });
                
                opponent.emit('matchFound', { 
                    gameId: gameId,
                    opponentId: socket.id,
                    yourTurn: false
                });
            } else {
                // Opponent disconnected, add to queue
                matchmakingQueue.push(socket.id);
                socket.emit('searching');
            }
        } else {
            // First in queue
            matchmakingQueue.push(socket.id);
            socket.emit('searching');
            console.log('  Added to queue, waiting for opponent...');
        }
    });
    
    // Cancel matchmaking
    socket.on('cancelMatch', () => {
        const index = matchmakingQueue.indexOf(socket.id);
        if (index > -1) {
            matchmakingQueue.splice(index, 1);
            console.log('❌ Player left queue:', socket.id);
        }
    });
    
    // Game actions (deck selection, turns, etc.)
    socket.on('gameAction', (data) => {
        console.log('🎮 Game action from', socket.id, ':', data.action);
        
        if (data.action === 'deckSelected') {
            console.log('  Processing deck selection, active games:', activeGames.size);
            
            // Find the game this player is in
            let foundGame = false;
            activeGames.forEach((game, gameId) => {
                if (game.player1.id === socket.id || game.player2.id === socket.id) {
                    foundGame = true;
                    console.log('  Found game:', gameId);
                    const isPlayer1 = game.player1.id === socket.id;
                    
                    // Store deck selection
                    const deckSize = Array.isArray(data.deck) ? data.deck.length : 'unknown';
                    
                    if (isPlayer1) {
                        game.player1.deck = data.deck;
                        game.player1.ready = true;
                        console.log('  ✅ Player 1 deck selected:', deckSize, 'cards');
                    } else {
                        game.player2.deck = data.deck;
                        game.player2.ready = true;
                        console.log('  ✅ Player 2 deck selected:', deckSize, 'cards');
                    }
                    
                    console.log('  Game state - P1 ready:', game.player1.ready, 'P2 ready:', game.player2.ready);
                    
                    // Notify opponent
                    const opponent = isPlayer1 ? game.player2 : game.player1;
                    opponent.socket.emit('opponentReady');
                    console.log('  Sent opponentReady to', opponent.id);
                    
                    // If both ready, start game
                    if (game.player1.ready && game.player2.ready) {
                        console.log('✅ Both players ready! Starting game:', gameId);
                        
                        // Emit as gameAction with type: gameStart (what frontend expects)
                        io.to(gameId).emit('gameAction', {
                            type: 'gameStart',
                            gameStarted: true,
                            player1Deck: game.player1.deck,
                            player2Deck: game.player2.deck,
                            firstPlayer: game.player1.id
                        });
                    }
                }
            });
            
            if (!foundGame) {
                console.log('  ❌ ERROR: Could not find game for player', socket.id);
                console.log('  Active games:', Array.from(activeGames.keys()));
            }
        } else {
            // Forward other actions to opponent
            activeGames.forEach((game, gameId) => {
                if (game.player1.id === socket.id || game.player2.id === socket.id) {
                    const opponent = game.player1.id === socket.id ? game.player2 : game.player1;
                    opponent.socket.emit('gameAction', data);
                }
            });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('👋 Player disconnected:', socket.id);
        
        // Remove from matchmaking queue
        const index = matchmakingQueue.indexOf(socket.id);
        if (index > -1) {
            matchmakingQueue.splice(index, 1);
        }
        
        // Handle active game disconnection
        activeGames.forEach((game, gameId) => {
            if (game.player1.id === socket.id || game.player2.id === socket.id) {
                console.log('🎮 Game abandoned:', gameId);
                const opponent = game.player1.id === socket.id ? game.player2 : game.player1;
                opponent.socket.emit('opponentDisconnected');
                activeGames.delete(gameId);
            }
        });
    });
});

// Server configuration
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces for cloud hosting

// Start server
server.listen(PORT, HOST, () => {
    console.log('================================================');
    console.log('  🎴 MYSTIC DUEL SERVER v3.2-MULTIPLAYER-FIXED 🎴');
    console.log('  BUILD: Feb 25, 2025 - Deck logging fixed');
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