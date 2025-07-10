# ShortsHub - AI-Powered Video Management Platform

## Overview

ShortsHub is a comprehensive full-stack web application that enables content creators to repurpose, create, schedule, and publish short-form video content across multiple social media platforms. The platform leverages AI technology to help creators transform existing content into engaging shorts while managing their multi-platform publishing workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Overall Structure
The application follows a full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React 19 with TypeScript, styled with Tailwind CSS
- **Backend**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL for persistent data storage
- **Storage**: Google Cloud Storage for media files
- **AI Services**: Google Gemini API for content generation and analysis

### Directory Structure
```
shortshub/
├── components/          # Reusable React components
├── pages/              # Application pages (Dashboard, Creator, Settings, etc.)
├── styles/             # Global CSS and Tailwind configurations
├── server/             # Backend API server
│   ├── src/
│   │   ├── api/        # API route handlers
│   │   ├── config/     # Database and authentication configuration
│   │   ├── middleware/ # Authentication and request processing
│   │   ├── services/   # External service integrations
│   │   ├── scripts/    # Database migrations and utilities
│   │   └── types/      # TypeScript type definitions
└── index.html          # Main HTML template
```

## Key Components

### Authentication System
- **Strategy**: JWT-based authentication with HttpOnly cookies
- **OAuth Integration**: Google OAuth 2.0 for user authentication
- **Social Platform Auth**: YouTube OAuth for content access and publishing
- **Security**: Passport.js for OAuth flows, bcrypt for password hashing

### Video Management
- **Upload System**: Multer-based file upload with Google Cloud Storage
- **Content Library**: PostgreSQL database storing video metadata
- **Platform Integration**: YouTube API for content retrieval and publishing
- **Processing**: Designed for asynchronous video processing via Google Cloud Pub/Sub

### AI-Powered Features
- **Content Analysis**: Google Gemini API for analyzing existing videos
- **Idea Generation**: AI-powered suggestions for short-form content creation
- **Content Refinement**: Automatic title and description optimization
- **Thumbnail Generation**: Imagen-3 API for custom thumbnail creation

### Frontend Architecture
- **Component-Based**: Modular React components with TypeScript
- **State Management**: React hooks for local state management
- **Routing**: Hash-based routing system
- **UI Framework**: Tailwind CSS for responsive design
- **Icons**: Custom SVG icon components

## Data Flow

### User Authentication Flow
1. User signs up/logs in via email/password or Google OAuth
2. JWT token generated and stored in HttpOnly cookie
3. Token validated on subsequent API requests
4. Social platform connections managed separately

### Content Creation Workflow
1. User uploads video file or connects to existing content
2. File stored in Google Cloud Storage
3. Video metadata saved to PostgreSQL database
4. AI analysis generates content suggestions
5. User refines content with AI assistance
6. Scheduled publishing to connected platforms

### API Request Flow
1. Frontend makes authenticated requests to Express API
2. JWT middleware validates user authentication
3. Route handlers process business logic
4. Services interact with external APIs (Google Cloud, YouTube)
5. Database operations via PostgreSQL connection pool
6. Response returned to frontend

## External Dependencies

### Google Cloud Platform
- **Storage**: Google Cloud Storage for media file hosting
- **AI Services**: Gemini API for content generation, Imagen-3 for thumbnails
- **Infrastructure**: Designed for Google Cloud Pub/Sub for async processing

### Social Platform APIs
- **YouTube**: OAuth authentication and content management
- **Future Platforms**: Architecture supports TikTok and Instagram integration

### Development Dependencies
- **TypeScript**: Type safety across frontend and backend
- **Build Tools**: Node.js build process with TypeScript compilation
- **Testing**: Jest framework configured for unit testing
- **Linting**: ESLint and Prettier for code quality

## Deployment Strategy

### Production Architecture
- **Database**: PostgreSQL (Google Cloud SQL compatible)
- **File Storage**: Google Cloud Storage buckets
- **Authentication**: Environment-based configuration for OAuth credentials
- **Scaling**: Stateless API design supports horizontal scaling

### Environment Configuration
- **Development**: Local PostgreSQL with hot-reloading via ts-node-dev
- **Production**: Cloud-based PostgreSQL with compiled JavaScript
- **Security**: Environment variables for sensitive credentials

### Database Schema
- **Users**: Authentication data, OAuth connections
- **Videos**: Content metadata, platform associations
- **Social Connections**: Platform-specific OAuth tokens and settings

The architecture prioritizes modularity, scalability, and security while maintaining a clean separation of concerns between different system components. The AI integration is designed to enhance the content creation workflow without overwhelming the user experience.