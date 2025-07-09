
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = express.Router();

// Get user's videos
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({ videos: result.rows });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get specific video
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const videoId = req.params.id;
    const result = await pool.query(
      'SELECT * FROM videos WHERE id = $1 AND user_id = $2',
      [videoId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ video: result.rows[0] });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Upload video (placeholder for now)
router.post('/upload', authenticateToken, async (req: any, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    
    if (!title || !videoUrl) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO videos (user_id, title, description, video_url, thumbnail_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, description, videoUrl, thumbnailUrl]
    );
    
    res.status(201).json({ video: result.rows[0] });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Update video
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const videoId = req.params.id;
    const { title, description } = req.body;
    
    const result = await pool.query(
      'UPDATE videos SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, description, videoId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ video: result.rows[0] });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const videoId = req.params.id;
    
    const result = await pool.query(
      'DELETE FROM videos WHERE id = $1 AND user_id = $2 RETURNING *',
      [videoId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
