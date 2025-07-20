const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const db = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const attendanceRoutes = require('./src/routes/attendance');
const adminRoutes = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(limiter);
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
    try {
        await db.connect();
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await db.close();
    process.exit(0);
});

startServer();