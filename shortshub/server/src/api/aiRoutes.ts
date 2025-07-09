
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generate video ideas
router.post('/generate-ideas', authenticateToken, async (req: any, res) => {
  try {
    const { topic, duration, style } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate 5 creative short video ideas about "${topic}". 
    Duration preference: ${duration || 'any'} seconds
    Style preference: ${style || 'any'}
    
    For each idea, provide:
    1. A catchy title
    2. A brief description (2-3 sentences)
    3. Key points to cover
    4. Suggested hook for the first 3 seconds
    
    Format as JSON array with objects containing: title, description, keyPoints, hook`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON, fallback to plain text if it fails
    let ideas;
    try {
      ideas = JSON.parse(text);
    } catch {
      ideas = [{ title: 'Generated Ideas', description: text, keyPoints: [], hook: '' }];
    }
    
    res.json({ ideas });
  } catch (error) {
    console.error('Generate ideas error:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

// Refine content (titles/descriptions)
router.post('/refine-content', authenticateToken, async (req: any, res) => {
  try {
    const { title, description, platform } = req.body;
    
    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Refine this content for ${platform || 'social media'} platform:
    
    Title: ${title || ''}
    Description: ${description || ''}
    
    Provide:
    1. 3 improved title options (catchy, SEO-friendly, platform-optimized)
    2. 1 refined description (engaging, clear, with relevant hashtags)
    
    Format as JSON: { "titles": ["title1", "title2", "title3"], "description": "refined description" }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON, fallback to structured response
    let refinedContent;
    try {
      refinedContent = JSON.parse(text);
    } catch {
      refinedContent = {
        titles: [title || 'Refined Title'],
        description: description || 'Refined description'
      };
    }
    
    res.json(refinedContent);
  } catch (error) {
    console.error('Refine content error:', error);
    res.status(500).json({ error: 'Failed to refine content' });
  }
});

// Generate thumbnail ideas
router.post('/generate-thumbnail', authenticateToken, async (req: any, res) => {
  try {
    const { prompt, style } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const thumbnailPrompt = `Generate 3 detailed thumbnail descriptions for a video about: "${prompt}"
    
    Style preference: ${style || 'modern and eye-catching'}
    
    Each description should include:
    1. Main visual elements
    2. Color scheme
    3. Text overlay suggestions
    4. Composition layout
    
    Format as JSON array with objects containing: visualElements, colorScheme, textOverlay, composition`;
    
    const result = await model.generateContent(thumbnailPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON, fallback to structured response
    let thumbnailIdeas;
    try {
      thumbnailIdeas = JSON.parse(text);
    } catch {
      thumbnailIdeas = [{
        visualElements: 'Generated thumbnail concept',
        colorScheme: 'Vibrant colors',
        textOverlay: prompt,
        composition: 'Centered layout'
      }];
    }
    
    res.json({ thumbnailIdeas });
  } catch (error) {
    console.error('Generate thumbnail error:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail ideas' });
  }
});

// Health check for AI service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Routes',
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

export default router;
