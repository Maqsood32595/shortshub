
import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Handle successful authentication
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

// YouTube OAuth routes
router.get('/youtube', authenticateToken, passport.authenticate('youtube'));

router.get('/youtube/callback',
  authenticateToken,
  passport.authenticate('youtube', { session: false }),
  (req, res) => {
    // Handle YouTube connection
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}#settings`);
  }
);

// Get connected platforms
router.get('/connections', authenticateToken, (req, res) => {
  // Mock platform connections
  const connections = {
    youtube: false,
    tiktok: false, 
    instagram: false
  };
  
  res.json({ connections });
});

// Connect platform
router.post('/connect/:platform', authenticateToken, (req, res) => {
  const { platform } = req.params;
  
  if (!['youtube', 'tiktok', 'instagram'].includes(platform)) {
    return res.status(400).json({ error: 'Invalid platform' });
  }
  
  // Mock connection success
  res.json({ 
    message: `${platform} connected successfully`,
    connected: true 
  });
});

// Disconnect platform
router.delete('/disconnect/:platform', authenticateToken, (req, res) => {
  const { platform } = req.params;
  
  res.json({ 
    message: `${platform} disconnected successfully`,
    connected: false 
  });
});

export default router;
