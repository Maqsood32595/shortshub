import { Router } from 'express';
import passport from 'passport';
import { authMiddleware } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = Router();

// --- Connect to YouTube ---

// Initiates the YouTube account connection flow
router.get('/youtube', authMiddleware, passport.authenticate('youtube'));

// YouTube OAuth callback route
router.get(
    '/youtube/callback',
    authMiddleware,
    passport.authenticate('youtube', { failureRedirect: '/#settings', session: false }),
    (req, res) => {
        // Successful connection. Passport has saved the tokens.
        // Redirect back to the settings page on the frontend.
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/#settings`);
    }
);


// --- Get Connection Statuses ---

router.get('/connections', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT provider FROM social_accounts WHERE user_id = $1',
            [req.user.id]
        );

        const connections = {
            youtube: false,
            tiktok: false,
            instagram: false,
        };

        result.rows.forEach(row => {
            if (row.provider in connections) {
                connections[row.provider as keyof typeof connections] = true;
            }
        });
        
        res.json(connections);

    } catch (error) {
        console.error('Error fetching connection statuses:', error);
        res.status(500).json({ error: 'Failed to get connection statuses.' });
    }
});


export default router;
