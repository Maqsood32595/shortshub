
# shortshub.app - AI Content Repurposing Hub

**shortshub.app** is a full-stack web application designed to help content creators effortlessly repurpose long-form video content into engaging, short-form videos for platforms like YouTube Shorts, TikTok, and Instagram Reels. It leverages the power of the Google Gemini API to generate creative ideas, scripts, and metadata, and uses a robust backend to handle video processing and user management.

![ShortsHub App Screenshot](https://storage.googleapis.com/project-av-prod/static/665f8c8646b5a3f1245089f2/screenshot.png)
*(Note: Screenshot is a representative image of the application's UI.)*

---

## ✨ Core Features

- **AI-Powered Content Generation**:
    - **Generate Ideas**: Provide a video transcript or summary and let the AI generate multiple distinct short-video concepts.
    - **Customizable Tone**: Tailor the AI's output by selecting a tone of voice (e.g., "Witty & Humorous", "Informational").
    - **Detailed Outputs**: Each idea includes a catchy title, a post description, a brief script outline, relevant hashtags, and a visual suggestion.
    - **Regeneration**: Don't like the results? Regenerate all ideas or just a single one with one click.

- **Video Management & Repurposing**:
    - **Secure Uploads**: Upload your master video files to your personal library.
    - **Video Library**: A "For You" style, full-screen, scrollable dashboard to browse your uploaded videos.
    - **Automatic Reformatting**: Select platforms and automatically process your horizontal video into the correct 9:16 aspect ratio, with appropriate padding and duration for each platform.

- **AI-Powered Transcription**:
    - **Generate from Video**: Upload a video and use the Gemini API to automatically generate its transcript, ready for content generation.

- **User & Session Management**:
    - **Secure Authentication**: Robust user registration and login system using JWT for secure sessions.
    - **Personalized Experience**: All uploaded videos and generated content are tied to your user account.
    - **Generation History**: Your recent content generation sessions are saved locally, allowing you to quickly load and review past ideas.

- **Export & Scheduling**:
    - **Export to CSV**: Easily export your generated short-form video ideas to a CSV file for use in other workflows.
    - **Scheduling UI**: A simple interface to mark reformatted videos as "scheduled" with a date, time, title, and description.

---

## 🛠️ Tech Stack

- **Frontend**:
    - **Framework**: React 19
    - **Language**: TypeScript
    - **Styling**: Tailwind CSS
    - **Module Loading**: ES Modules served directly via `esm.sh` (no bundler needed for development).

- **Backend**:
    - **Runtime**: Node.js
    - **Framework**: Express.js
    - **Database**: PostgreSQL
    - **Authentication**: JSON Web Tokens (JWT)
    - **Password Hashing**: bcrypt
    - **Video Processing**: `fluent-ffmpeg`

- **AI Provider**:
    - **Google Gemini API** (`gemini-2.5-flash-preview-04-17`) for content generation and transcription.

---

## 📂 Project Structure

```
.
├── components/          # React components (Cards, Forms, Icons, etc.)
├── pages/               # Top-level page components (Dashboard, Generator)
├── services/            # Frontend services (api.ts, etc.)
├── server/              # All backend code
│   ├── src/
│   │   ├── api/         # API controllers, routes, and main index
│   │   ├── config/      # Database configuration (db.js)
│   │   ├── middleware/  # Auth protection middleware
│   │   └── services/    # Backend services (video processing logic)
│   ├── .env.example     # Example environment file
│   ├── package.json
│   └── server.js        # Express server entry point
├── uploads/             # (Generated) Stores original uploaded videos
│   └── processed/       # (Generated) Stores reformatted videos
├── App.tsx              # Main React App component
├── index.html           # Main HTML entry point
├── index.tsx            # React root renderer
└── README.md            # This file
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **PostgreSQL**: A running instance of PostgreSQL.
- **FFmpeg**: The FFmpeg library must be installed on your system and accessible from the command line. This is crucial for video processing.

### 1. Backend Setup

1.  **Navigate to the server directory**:
    ```sh
    cd server
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Create an environment file**:
    - Copy the example `.env.example` to a new `.env` file.
    - Fill in the required values:
      ```env
      # .env file in server/

      # 1. Google Gemini API Key
      # Get this from Google AI Studio
      API_KEY="YOUR_GEMINI_API_KEY"

      # 2. Database Connection URL
      # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
      DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/shortshub_db"

      # 3. JWT Secret
      # A long, random, and secure string for signing authentication tokens.
      JWT_SECRET="a-very-long-and-random-secret-key-for-your-jwt-tokens"

      # 4. Port (Optional)
      # The port the server will run on. Defaults to 5000.
      PORT=5000
      ```

4.  **Set up the database**:
    - Connect to your PostgreSQL instance.
    - Create a new database (e.g., `shortshub_db`).
    - Run the following SQL script to create the necessary tables:
      ```sql
      -- Creates the table to store user information
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Creates the table to store video metadata and their variants
      CREATE TABLE videos (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          filename VARCHAR(255) NOT NULL,
          storage_path VARCHAR(255) NOT NULL,
          duration_seconds INTEGER,
          variants JSONB, -- Stores array of platform-specific video data
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ```

5.  **Start the server**:
    ```sh
    # For development with auto-reloading
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (or 5000 by default).

### 2. Frontend Setup

The frontend is served directly by the backend Express server. There is no separate start command.

- **Access the application** by opening your web browser and navigating to: `http://localhost:5000`

---

## 💡 Future Improvements

- **Background Job Queue**: Video processing is resource-intensive. For a production environment, this should be offloaded to a background worker process using a queue system like BullMQ or a cloud service like Google Cloud Tasks.
- **Direct Social Media Integration**: Use official platform APIs to schedule and post videos directly from the app.
- **Advanced Video Editing**: Add features like auto-captioning, progress bars, or merging clips.
- **Cloud Storage**: Integrate with a cloud storage provider (like Google Cloud Storage or AWS S3) instead of storing files on the local server filesystem.
