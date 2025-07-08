
# ShortsHub.app

ShortsHub is a full-stack web application designed to help content creators repurpose their long-form videos into engaging short-form content for platforms like YouTube Shorts, TikTok, and Instagram. It leverages AI to generate ideas, refine descriptions, and even create new video content from text prompts.

## Core Features

- **Secure User Authentication**: Sign up and log in with a traditional email/password or with a Google account. Sessions are securely managed with JWTs.
- **Direct Video Uploads**: Upload your existing video files directly to the platform, powered by Google Cloud Storage.
- **AI-Powered Repurposing**: Select one of your uploaded videos and use AI to:
    - Generate multiple, engaging clip ideas with titles, descriptions, and timestamps.
    - Refine descriptions to be more catchy and social-media-friendly.
    - Generate unique, clickable thumbnails from a text prompt using Imagen-3.
- **AI Video Editor**: A dedicated page to generate entirely new short videos from a text prompt, simulating Google's Veo model.
- **"My Shorts" Library**: A modern, "For You" style, full-screen, scrollable feed where you can view all your uploaded and AI-generated shorts.
- **Social Account Connections**: Securely connect your YouTube account using OAuth 2.0 to prepare for future cross-platform features.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport.js (Google OAuth 2.0, YouTube OAuth 2.0)
- **AI**: Google Gemini & Imagen APIs (`@google/genai`)
- **File Storage**: Google Cloud Storage

## Project Structure

```
.
├── App.tsx
├── index.html
├── index.tsx
├── components/
│   ├── Logo.tsx
│   └── icons.tsx
├── pages/
│   ├── AIEditorPage.tsx
│   ├── CreatorPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── MyShortsPage.tsx
│   └── SettingsPage.tsx
└── server/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── api/
        │   ├── aiRoutes.ts
        │   ├── authRoutes.ts
        │   ├── socialAuthRoutes.ts
        │   └── videoRoutes.ts
        ├── config/
        │   ├── db.ts
        │   └── passport.ts
        ├── middleware/
        │   └── authMiddleware.ts
        ├── services/
        │   ├── storageService.ts
        │   └── pubsubService.ts (if implemented)
        └── types/
            └── express/
                └── index.d.ts
```

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database running locally or on the cloud.

### Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    - Create a new PostgreSQL database.
    - Execute the schema from `database.sql` to create the necessary tables.

4.  **Configure Environment Variables:**
    - Create a `.env` file in the `server/` directory.
    - Copy the contents from `server/.env.example` (if provided) or add the following variables, filling in your own credentials:
      ```env
      # Database
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

      # Authentication
      JWT_SECRET="YOUR_SUPER_SECRET_KEY"
      CLIENT_URL="http://localhost:3000" # Or your frontend's address
      SERVER_URL="http://localhost:5001" # Or your server's address

      # Google OAuth for Login
      GOOGLE_CLIENT_ID="your_google_client_id"
      GOOGLE_CLIENT_SECRET="your_google_client_secret"

      # YouTube OAuth for Account Connection
      YOUTUBE_CLIENT_ID="your_youtube_client_id"
      YOUTUBE_CLIENT_SECRET="your_youtube_client_secret"
      
      # Google Cloud & GenAI
      API_KEY="your_google_genai_api_key"
      GCP_PROJECT_ID="your_gcp_project_id"
      GCS_BUCKET_NAME="your_gcs_bucket_name"
      ```

5.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5001`.

### Frontend Setup

The frontend is built with React and uses modern ESM imports, meaning no complex build step is required for development.

1.  **Open `index.html`:**
    - Simply open the `index.html` file in your web browser. A live server extension in your code editor (like VS Code's "Live Server") is recommended for the best experience.

The application should now be fully running and accessible.
