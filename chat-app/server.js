const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const webhookRouter = require('./routes/webhook');
const DialogflowService = require('./services/dialogflowService');
const uuid = require('uuid');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with improved CORS settings
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
        methods: ['GET', 'POST']
    }
});

// Dialogflow Configuration
const DIALOGFLOW_PROJECT_ID = process.env.PROJECT_ID;
const dialogflow = new DialogflowService(
    DIALOGFLOW_PROJECT_ID,
    process.env.JSON_FILE_PATH
);

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/webhook', apiLimiter);

// Request parsing
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookRouter);
app.get("/", (req, res) => res.send("Server is running"));
app.get("/health", (req, res) => res.status(200).json({ status: 'ok' }));

// WebSocket Connection Handler
io.on('connection', (socket) => {
    const sessionId = uuid.v4();
    console.log(`Client connected: ${socket.id} (Session: ${sessionId})`);

    socket.on('message', async (text) => {
        try {
            console.log(`Received message from ${socket.id}: ${text}`);
            const result = await dialogflow.detectIntent(sessionId, text);
            socket.emit('message', result);
        } catch (error) {
            console.error(`Error processing message: ${error.message}`);
            socket.emit('error', { message: 'Failed to process message', code: 500 });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Unhandled error: ${err.stack}`);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server_instance = server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handling
const shutdownGracefully = () => {
    console.log('Shutting down gracefully...');
    server_instance.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

module.exports = { app, server }; // Export for testing