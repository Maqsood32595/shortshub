import { Router } from 'express';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';
import passport from 'passport';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, password_hash]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error: any) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ error: 'Username already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
     if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        } as any);

        res.json({ id: user.id, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// Logout a user
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
});

// Get current user (check auth status)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
});


// --- Google OAuth Routes ---

// Initiates the Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req: express.Request, res: express.Response) => {
        // On successful authentication, passport attaches the user to req.user.
        // We generate a JWT and set it as a cookie.
        const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        } as any);

        // Redirect to the frontend application
        res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
    }
);


export default router;
