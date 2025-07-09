# ShortsHub.app - Shorts Multi-Platform Uploading and Scheduling & Google Veo AI

ShortsHub is a full-stack web application that empowers content creators to efficiently repurpose, create, schedule, and publish short-form video content across multiple social media platforms like YouTube Shorts, TikTok, and Instagram Reels.

The platform's core is a robust backend that leverages Google Cloud services for scalability, including AI-powered content creation with the Gemini and Imagen APIs, asynchronous video processing, and secure user management.

Core Features
Content Management & Scheduling
Centralized "My Shorts" Library: An immersive, "For You" style, full-screen scrollable feed to view and manage all your short-form video content.
Direct Video Uploads: Upload your existing short video files (MP4, MOV) directly to the platform via Google Cloud Storage.
Automated Video Reformatting: Asynchronous, serverless processing to automatically adapt videos to platform-compliant specifications (9:16 aspect ratio, duration limits) for YouTube, TikTok, and Reels.
Multi-Platform Scheduling: A granular interface to schedule your finalized shorts for upload to connected social media accounts at a specific date and time. (Note: Scheduling execution via backend API is planned).
AI-Powered Creation & Repurposing
Repurpose Existing Videos: Select an uploaded long-form video and use AI to generate multiple, engaging clip ideas complete with catchy titles, descriptions, and suggested timestamps.
AI Content Refinement: Enhance your titles and descriptions with a single click using AI to make them more engaging and SEO-friendly.
AI Thumbnail Generation: Create unique, clickable thumbnails for your shorts from a simple text prompt using Google's Imagen-3 model.
AI Video Editor (Text-to-Video): A dedicated interface to generate entirely new short videos from a textual description, simulating Google's Veo model for creating filler or B-roll content.
Account & Platform Integration
Secure User Authentication: Sign up and log in with a traditional email/password or with a Google account (OAuth 2.0). Sessions are securely managed with JWTs stored in HttpOnly cookies.
Social Account Connections: Securely connect your YouTube account using OAuth 2.0 to authorize the application for future uploads and data access.
Tech Stack & Architecture
ShortsHub is built with a modern, scalable architecture designed to handle complex media processing and AI tasks efficiently.

Frontend: React 19 with TypeScript for a modern, type-safe UI, styled with Tailwind CSS.
Backend: Node.js with Express.js and TypeScript, built with a clean separation of concerns (services, routes, middleware).
Database: PostgreSQL (designed for Google Cloud SQL) for storing user data, video metadata, and social account tokens.
Authentication: Passport.js for handling Google and YouTube OAuth 2.0 flows, and JWT for session management.
File Storage: Google Cloud Storage for storing raw uploads, AI-generated outputs, and platform-ready processed videos.
AI & ML: Google Gemini API for text-based generation and Imagen-3 for image generation.
Asynchronous Processing: Google Cloud Pub/Sub (architecture in place) to decouple long-running tasks like video transcoding and AI generation from the user request, ensuring a responsive UI.
PROJECT STRUCTURE
.
├── App.tsx
├── ... (other frontend components & pages) ...
└── server/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── api/                # API route handlers
        ├── config/             # Database & Passport config
        ├── middleware/         # Auth middleware
        ├── services/           # Services for GCS, Pub/Sub
        └── types/              # Express type extensions
Local Development Setup
Prerequisites
Node.js (v18 or higher)
PostgreSQL database running locally or on the cloud.
Access to Google Cloud Platform for API keys and service credentials.
Backend Setup
Navigate to the server directory:

cd server
Install dependencies:

npm install
Set up the database:

Create a new PostgreSQL database.
Execute the schema from database.sql (if provided, or create tables based on API logic) to set up the required tables.
Configure Environment Variables:

Create a .env file in the server/ directory.
Copy the contents from server/.env.example and fill in your credentials.
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Authentication
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
CLIENT_URL="http://localhost:3000"
SERVER_URL="http://localhost:5001"

# Google OAuth for Login
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# YouTube OAuth for Account Connection
YOUTUBE_CLIENT_ID="your_youtube_client_id.apps.googleusercontent.com"
YOUTUBE_CLIENT_SECRET="your_youtube_client_secret"

# Google Cloud & GenAI
API_KEY="your_google_genai_api_key"
GCP_PROJECT_ID="your_gcp_project_id"
GCS_BUCKET_NAME="your_gcs_bucket_name"
Run the backend server:

npm run dev
The server will be running on http://localhost:5001.

Frontend Setup
The frontend is a single-page application built with modern tooling that runs directly in the browser without a separate build step for development.

Open index.html in a web browser.
Using a tool like the Live Server extension for VS Code is highly recommended for the best development experience with hot-reloading.
The application should now be fully running and accessible at your live server's address (e.g., http://localhost:3000 or http://127.0.0.1:5500).
