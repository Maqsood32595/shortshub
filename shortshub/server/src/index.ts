import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './api/authRoutes';
import socialAuthRoutes from './api/socialAuthRoutes';
import videoRoutes from './api/videoRoutes';
import aiRoutes from './api/aiRoutes';

// Import middleware
import { authenticateToken } from './middleware/authMiddleware'; // Make sure this path is correct

// Import config (for passport setup)
import './config/passport'; // Ensure this file correctly sets up Passport strategies

const app = express();

// Fix: Ensure PORT is a number. Environment variables are always strings.
const PORT = parseInt(process.env.PORT || '5001', 10);
// Alternatively, using Number():
// const PORT = Number(process.env.PORT || 5001);


// Middleware
app.use(helmet()); // Basic security headers
app.use(compression()); // Compress response bodies for faster loading

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from your frontend
    credentials: true // Allow cookies to be sent with requests
}));

app.use(express.json({ limit: '50mb' })); // Parse JSON request bodies, increase limit for potential video metadata
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(passport.initialize()); // Initialize Passport for authentication

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0' // Provides app version if defined in package.json
    });
});

// API routes
// The `authenticateToken` middleware can be applied here for routes that require authentication
app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)
app.use('/api/social', socialAuthRoutes); // Social login/authentication routes
app.use('/api/videos', videoRoutes); // Video related routes (upload, stream, details)
app.use('/api/ai', aiRoutes); // AI related routes (e.g., for video analysis, recommendations)


// Serve static files (React app)
// This block ensures your backend also serves your frontend build in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'build' directory of your frontend app
    // Adjust '../../build' path if your project structure is different
    // e.g., if build is directly in the root, it might be '../build' or './build' relative to compiled JS
    app.use(express.static(path.join(__dirname, '../../build')));

    // For any other GET request not matched by API routes, serve the frontend's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'));
    });
}

// Error handling middleware
// This catches errors thrown by previous middleware or route handlers
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); // Log the full error stack for debugging
    res.status(500).json({
        error: 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Only send stack in development for security
    });
});

// 404 handler (must be last middleware before app.listen)
// This catches any requests that didn't match any defined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
