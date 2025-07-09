
import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = express.Router();

// Get connected social accounts
router.get('/connections', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT provider, provider_id, display_name, channel_id, created_at FROM social_accounts WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({ connections: result.rows });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Connect YouTube account
router.get('/youtube', authenticateToken, passport.authenticate('youtube', {
  scope: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

// YouTube callback
router.get('/youtube/callback', 
  authenticateToken,
  passport.authenticate('youtube', { session: false }),
  (req: any, res) => {
    // Connection successful, redirect to frontend
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/settings?connected=youtube`);
  }
);

// Disconnect social account
router.delete('/disconnect/:provider', authenticateToken, async (req: any, res) => {
  try {
    const provider = req.params.provider;
    
    const result = await pool.query(
      'DELETE FROM social_accounts WHERE user_id = $1 AND provider = $2 RETURNING *',
      [req.user.id, provider]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    res.json({ message: `${provider} account disconnected successfully` });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
});

// Get YouTube channel info
router.get('/youtube/channel', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM social_accounts WHERE user_id = $1 AND provider = $2',
      [req.user.id, 'youtube']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'YouTube account not connected' });
    }
    
    const account = result.rows[0];
    
    // Here you would typically use the access token to fetch channel data from YouTube API
    res.json({ 
      channel: {
        id: account.channel_id,
        name: account.display_name,
        connected: true
      }
    });
  } catch (error) {
    console.error('Get YouTube channel error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube channel info' });
  }
});

export default router;
