import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import apiRoutes from './routes/api';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ==================== ROUTES ====================

app.use('/api', apiRoutes);

// Production setup
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ==================== ERROR HANDLING ====================

app.use(notFoundHandler);
app.use(errorHandler);

// ==================== START SERVER ====================

const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();

        // Start server
        app.listen(PORT, () => {
            console.log('╔═══════════════════════════════════════╗');
            console.log('║   🚀 השרת רץ בהצלחה!                ║');
            console.log('╠═══════════════════════════════════════╣');
            console.log(`║   📡 כתובת: http://localhost:${PORT}    ║`);
            console.log(`║   🌐 סביבה: ${process.env.NODE_ENV || 'development'}          ║`);
            console.log('╚═══════════════════════════════════════╝');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 מקבל SIGTERM, סוגר את השרת בחן...');
    process.exit(0);
});