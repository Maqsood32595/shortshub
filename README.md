
# ShortsHub.app - AI-Powered Social Video Management

ShortsHub is a full-stack web application that empowers content creators to efficiently repurpose, create, schedule, and publish short-form video content across multiple social media platforms like YouTube Shorts, TikTok, and Instagram Reels.

## Quick Start on Replit

1. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your Google Cloud and OAuth credentials

2. **Run the Application**
   - Click the "Run" button to start the server
   - The application will be available at the provided URL

3. **Development**
   - Use the "Development" workflow for hot-reloading during development
   - Server runs on port 5001 by default

## Features

### Content Management & Scheduling
- **Centralized "My Shorts" Library**: Full-screen scrollable feed to view and manage all your short-form video content
- **Direct Video Uploads**: Upload your existing short video files directly to the platform
- **Multi-Platform Scheduling**: Schedule your finalized shorts for upload to connected social media accounts

### AI-Powered Creation & Repurposing
- **Repurpose Existing Videos**: Use AI to generate multiple engaging clip ideas from long-form videos
- **AI Content Refinement**: Enhance titles and descriptions with AI
- **AI Thumbnail Generation**: Create unique thumbnails from text prompts
- **AI Video Editor**: Generate new short videos from textual descriptions

### Account & Platform Integration
- **Secure User Authentication**: Sign up with email/password or Google OAuth
- **Social Account Connections**: Connect your YouTube account for uploads

## Tech Stack

- **Frontend**: React 19 with TypeScript, styled with Tailwind CSS
- **Backend**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL for user data and video metadata
- **Authentication**: Passport.js for OAuth flows and JWT for session management
- **File Storage**: Google Cloud Storage for uploads and processed videos
- **AI & ML**: Google Gemini API for text generation and Imagen-3 for image generation

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Google Cloud Platform account with API keys

### Local Development

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run Database Migrations**
   ```bash
   cd server
   npm run migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Deployment on Replit

1. **Configure Environment Variables**
   - Set up your `.env` file with production values
   - Ensure database and Google Cloud credentials are correct

2. **Deploy**
   - Push your code to Replit
   - The app will automatically build and deploy
   - Access your app at the provided Replit URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout

### Videos
- `GET /api/videos` - Get user's videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos/:id` - Get specific video

### AI Features
- `POST /api/ai/generate-ideas` - Generate video ideas
- `POST /api/ai/refine-content` - Refine titles/descriptions
- `POST /api/ai/generate-thumbnail` - Generate thumbnails

### Social Integration
- `GET /api/social/connections` - Get connected accounts
- `GET /api/social/youtube` - Connect YouTube account

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your-jwt-secret

# Google Cloud
GCP_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=your-bucket-name
API_KEY=your-genai-api-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

# Application
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5001
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
