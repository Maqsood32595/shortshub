import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as YouTubeV3Strategy } from 'passport-youtube-v3';
import pool from './db';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

// Strategy for user login/registration with Google
passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails?.[0].value;

    if (!email) {
        return done(new Error("No email found in Google profile"), undefined);
    }
    
    try {
        let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);
        let user = userResult.rows[0];

        if (user) {
            return done(null, user);
        } else {
            userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            user = userResult.rows[0];
            
            if (user) {
                const updatedUserResult = await pool.query(
                    'UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *',
                    [id, email]
                );
                return done(null, updatedUserResult.rows[0]);
            } else {
                const newUserResult = await pool.query(
                    'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [displayName, email, id]
                );
                return done(null, newUserResult.rows[0]);
            }
        }
    } catch (err) {
        return done(err, undefined);
    }
}));


// Strategy for connecting a YouTube account for an already logged-in user
passport.use('youtube', new YouTubeV3Strategy({
    clientID: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    callbackURL: `${process.env.SERVER_URL}/api/social/youtube/callback`,
    scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
    passReqToCallback: true, // Allows us to access the request object in the callback
    authorizationParams: {
        access_type: 'offline', // Request a refresh token
        prompt: 'consent' // Re-prompt for consent to ensure a refresh token is issued
    }
},
async (req: any, accessToken, refreshToken, profile, done) => {
    // req.user is populated by our authMiddleware
    const userId = req.user.id; 

    if (!userId) {
        return done(new Error("User not authenticated."), undefined);
    }

    try {
        const { id: providerId, displayName, _json } = profile;
        const channelId = _json.items[0]?.id || providerId; // YouTube specific channel ID

        // Insert or update the social account connection
        // Using ON CONFLICT to handle re-connections gracefully
        await pool.query(
            `INSERT INTO social_accounts (user_id, provider, provider_id, channel_id, display_name, access_token, refresh_token)
             VALUES ($1, 'youtube', $2, $3, $4, $5, $6)
             ON CONFLICT (user_id, provider)
             DO UPDATE SET 
                provider_id = EXCLUDED.provider_id,
                channel_id = EXCLUDED.channel_id,
                display_name = EXCLUDED.display_name,
                access_token = EXCLUDED.access_token,
                refresh_token = COALESCE(EXCLUDED.refresh_token, social_accounts.refresh_token), -- Keep old refresh token if new one is null
                updated_at = NOW()`,
            [userId, providerId, channelId, displayName, accessToken, refreshToken]
        );
        
        // We are only connecting an account, not logging in.
        // We pass the original user object through.
        return done(null, req.user);
    } catch (err) {
        return done(err, undefined);
    }
}));

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
    } catch (error) {
      // Token invalid but continue without auth
      console.warn('Optional auth failed:', error);
    }
  }

  next();
};