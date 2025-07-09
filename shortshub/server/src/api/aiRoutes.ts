import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generate video ideas using AI
router.post('/generate-ideas', authenticateToken, async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback to mock data if no API key
      const ideas = [
        {
          title: `${videoTitle} - Key Highlights`,
          description: 'Focus on the most important points from the video',
          timestamp: new Date().toISOString()
        },
        {
          title: `${videoTitle} - Quick Tips`, 
          description: 'Extract actionable tips and advice',
          timestamp: new Date().toISOString()
        }
      ];
      return res.json({ ideas });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate 3 creative short video ideas based on this content:
    Title: ${videoTitle}
    Description: ${videoDescription}

    Format each idea as:
    Title: [engaging title]
    Description: [brief description]

    Make them engaging for social media platforms like TikTok, Instagram Reels, and YouTube Shorts.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the AI response into structured ideas
    const ideas = parseAIResponse(text);

    res.json({ ideas });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

// Refine content using AI
router.post('/refine-content', authenticateToken, async (req, res) => {
  try {
    const { title, description, platform } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        refinedTitle: `${title} - Refined`,
        refinedDescription: `${description} - Optimized for ${platform}`
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Refine this content for ${platform}:
    Title: ${title}
    Description: ${description}

    Make it more engaging and platform-appropriate. Keep titles under 100 characters.
    Return in format:
    TITLE: [refined title]
    DESCRIPTION: [refined description]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const refinedContent = parseRefinedContent(text);

    res.json(refinedContent);
  } catch (error) {
    console.error('AI refinement error:', error);
    res.status(500).json({ error: 'Failed to refine content' });
  }
});

// Generate thumbnail using AI
router.post('/generate-thumbnail', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;

    // Mock thumbnail generation for now
    const thumbnailUrl = `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;

    res.json({ thumbnailUrl });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
});

// Helper functions
function parseAIResponse(text: string): any[] {
  const ideas = [];
  const lines = text.split('\n');
  let currentIdea: any = {};

  for (const line of lines) {
    if (line.toLowerCase().includes('title:')) {
      if (currentIdea.title) {
        ideas.push({ ...currentIdea, timestamp: new Date().toISOString() });
      }
      currentIdea = { title: line.replace(/title:/i, '').trim() };
    } else if (line.toLowerCase().includes('description:')) {
      currentIdea.description = line.replace(/description:/i, '').trim();
    }
  }

  if (currentIdea.title) {
    ideas.push({ ...currentIdea, timestamp: new Date().toISOString() });
  }

  return ideas.slice(0, 3);
}

function parseRefinedContent(text: string): any {
  const lines = text.split('\n');
  let refinedTitle = '';
  let refinedDescription = '';

  for (const line of lines) {
    if (line.toLowerCase().includes('title:')) {
      refinedTitle = line.replace(/title:/i, '').trim();
    } else if (line.toLowerCase().includes('description:')) {
      refinedDescription = line.replace(/description:/i, '').trim();
    }
  }

  return { refinedTitle, refinedDescription };
}

export default router;