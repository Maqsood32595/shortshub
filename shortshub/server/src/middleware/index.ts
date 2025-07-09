import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import authRoutes from '../api/authRoutes';
import videoRoutes from '../api/videoRoutes';
import aiRoutes from '../api/aiRoutes';
import socialAuthRoutes from '../api/socialAuthRoutes';

import './config/passport'; // Initialize passport config

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/social', socialAuthRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'ShortsHub API is running!' });
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export { authenticateToken } from './authMiddleware';