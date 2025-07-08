import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import pool from '../config/db';
import multer from 'multer';
import { uploadFile } from '../services/storageService';

const router = Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB limit
});

// GET all videos for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        // Transform snake_case to camelCase for the frontend
        const videos = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            thumbnailUrl: row.thumbnail_url,
            videoUrl: row.gcs_url,
            duration: row.duration_seconds ? new Date(row.duration_seconds * 1000).toISOString().substr(14, 5) : '00:00', // Format seconds to MM:SS
            type: row.source,
            originalVideoId: row.original_video_id,
            originalVideoThumbnailUrl: row.original_video_thumbnail_url,
            generatedThumbnailUrl: row.generated_thumbnail_url,
        }));

        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Server error while fetching videos.' });
    }
});

// POST a new video upload
router.post('/upload', authMiddleware, upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded.' });
    }

    try {
        const gcsUrl = await uploadFile(req.file);
        const title = req.file.originalname.replace(/\.[^/.]+$/, "");
        const description = 'User uploaded video';
        const source = 'uploaded';
        const duration_seconds = 0; // Placeholder
        const thumbnail_url = gcsUrl; // Use video URL as placeholder thumbnail for now

        const newVideo = await pool.query(
            `INSERT INTO videos (user_id, title, description, gcs_url, thumbnail_url, duration_seconds, source) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, title, thumbnail_url, duration_seconds`,
            [req.user.id, title, description, gcsUrl, thumbnail_url, duration_seconds, source]
        );
        
        const video = newVideo.rows[0];

        res.status(201).json({
            id: video.id,
            title: video.title,
            thumbnailUrl: video.thumbnail_url,
            videoUrl: gcsUrl,
            duration: new Date(video.duration_seconds * 1000).toISOString().substr(14, 5),
            type: source,
        });

    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Failed to upload video.' });
    }
});

// POST to save a repurposed video from an existing one
router.post('/save-repurpose', authMiddleware, async (req, res) => {
    const { idea, originalVideoId } = req.body;
    if (!idea || !originalVideoId) {
        return res.status(400).json({ error: 'Missing idea or original video ID.' });
    }

    try {
        // Fetch original video details
        const originalVideoRes = await pool.query('SELECT thumbnail_url FROM videos WHERE id = $1 AND user_id = $2', [originalVideoId, req.user.id]);
        if(originalVideoRes.rowCount === 0) {
            return res.status(404).json({ error: 'Original video not found.' });
        }
        const originalVideoThumbnailUrl = originalVideoRes.rows[0].thumbnail_url;

        const { title, description, generatedThumbnailUrl } = idea;
        
        const result = await pool.query(
            `INSERT INTO videos (user_id, title, description, source, original_video_id, original_video_thumbnail_url, generated_thumbnail_url, thumbnail_url)
             VALUES ($1, $2, $3, 'generated', $4, $5, $6, $7)
             RETURNING id`,
            [req.user.id, title, description, originalVideoId, originalVideoThumbnailUrl, generatedThumbnailUrl, generatedThumbnailUrl || originalVideoThumbnailUrl]
        );

        res.status(201).json({ success: true, id: result.rows[0].id });

    } catch (error) {
        console.error('Error saving repurposed short:', error);
        res.status(500).json({ error: 'Failed to save repurposed short.' });
    }
});

// POST to save an AI generated video
router.post('/save-ai-video', authMiddleware, async (req, res) => {
    const { title, description, videoUrl } = req.body;
     if (!title || !description || !videoUrl) {
        return res.status(400).json({ error: 'Missing title, description, or video URL.' });
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO videos (user_id, title, description, source, gcs_url, thumbnail_url)
             VALUES ($1, $2, $3, 'ai-generated', $4, $5)
             RETURNING id`,
            [req.user.id, title, description, videoUrl, videoUrl] // Use video URL as its own thumbnail for now
        );
        
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error saving AI video:', error);
        res.status(500).json({ error: 'Failed to save AI video.' });
    }
});


export default router;
