import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Mock video storage
const videos: any[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    duration: '15:30',
    description: 'A comprehensive guide to React fundamentals'
  },
  {
    id: '2', 
    title: 'JavaScript ES6 Features',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2',
    duration: '12:45',
    description: 'Exploring modern JavaScript features'
  }
];

const creations: any[] = [];

// Get user's videos
router.get('/', authenticateToken, (req, res) => {
  res.json({ videos });
});

// Get video by ID
router.get('/:id', authenticateToken, (req, res) => {
  const video = videos.find(v => v.id === req.params.id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.json({ video });
});

// Get user's creations/shorts
router.get('/user/creations', authenticateToken, (req, res) => {
  res.json({ creations });
});

// Create new short from video
router.post('/:id/create-short', authenticateToken, (req, res) => {
  const { title, description, idea } = req.body;
  const video = videos.find(v => v.id === req.params.id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const creation = {
    id: creations.length + 1,
    type: 'ai-generated',
    title: title || `Short from ${video.title}`,
    description: description || `Generated short based on: ${idea}`,
    timestamp: new Date().toISOString(),
    originalVideoId: video.id,
    originalVideoThumbnailUrl: video.thumbnailUrl,
    generatedThumbnailUrl: `https://picsum.photos/400/600?random=${creations.length + 10}`,
    videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4`,
    platformReady: {
      youtube: true,
      tiktok: true,
      instagram: true
    }
  };

  creations.push(creation);

  res.status(201).json({
    message: 'Short created successfully',
    creation
  });
});

export default router;