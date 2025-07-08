import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const router = Router();

if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generate clip ideas from a long-form video's metadata
router.post('/generate-ideas', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Video title and description are required.' });
    }

    const prompt = `
        Based on the following YouTube video details, generate 5 engaging ideas for short vertical clips (like YouTube Shorts or TikToks). 
        For each idea, provide a catchy title, a suggested timestamp from the original video (e.g., "01:23 - 01:55"), and a brief, compelling description for the short video.
        Format the output as a JSON array of objects. Each object should have three properties: "title", "timestamp", and "description".

        Video Title: "${title}"
        Video Description: "${description}"

        JSON Output:
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const ideas = JSON.parse(jsonStr);
        res.json(ideas);
    } catch (error) {
        console.error('AI idea generation failed:', error);
        res.status(500).json({ error: 'Failed to generate ideas from AI.' });
    }
});

// Refine a description using AI
router.post('/refine-description', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }
    
    const prompt = `
        You are a social media expert. Rewrite the following description for a short video to be more engaging and catchy. 
        Keep it concise and add 2-3 relevant hashtags.

        Original Title: "${title}"
        Original Description: "${description}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });
        res.json({ newDescription: response.text });
    } catch (error) {
        console.error('AI description refinement failed:', error);
        res.status(500).json({ error: 'Failed to refine description.' });
    }
});

// Generate a thumbnail image
router.post('/generate-thumbnail', authMiddleware, async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'A title is required to generate a thumbnail.' });
    }

    const prompt = `A cinematic, eye-catching thumbnail for a YouTube Short titled "${title}". Make it vibrant, high-energy, and clickable.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error('No image was generated.');
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        
        res.json({ imageUrl });
    } catch (error) {
        console.error('AI thumbnail generation failed:', error);
        res.status(500).json({ error: 'Failed to generate thumbnail.' });
    }
});

// Simulate generating a video from a text prompt
router.post('/generate-video', authMiddleware, async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'A prompt is required.' });
    }

    const generationPrompt = `
        You are an AI video generator. Based on the following prompt, generate a compelling title and a short, engaging description for the video.
        
        Prompt: "${prompt}"

        Format the output as a single JSON object with two properties: "title" and "description".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: generationPrompt,
            config: { responseMimeType: "application/json" }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const metadata = JSON.parse(jsonStr);

        // In a real app, this would be a URL from a GCS bucket where the Veo-generated video is stored.
        // We use a placeholder for this simulation.
        const mockVideoUrl = 'https://storage.googleapis.com/web-dev-assets/video-api-demo/flowers.mp4';

        res.json({
            title: metadata.title,
            description: metadata.description,
            videoUrl: mockVideoUrl,
        });

    } catch (error) {
        console.error('AI video generation failed:', error);
        res.status(500).json({ error: 'Failed to generate video metadata.' });
    }
});

export default router;
