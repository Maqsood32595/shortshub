
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as YouTubeV3Strategy } from 'passport-youtube-v3';
import pool from './db';

// Configure Google Strategy for user authentication
passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
},
async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
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

// Configure YouTube Strategy for social account linking
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
    passReqToCallback: true,
    authorizationParams: {
        access_type: 'offline',
        prompt: 'consent'
    }
},
async (req: any, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    const userId = req.user?.id;

    if (!userId) {
        return done(new Error("User not authenticated."), undefined);
    }

    try {
        const { id: providerId, displayName, _json } = profile;
        const channelId = _json.items[0]?.id || providerId;

        await pool.query(
            `INSERT INTO social_accounts (user_id, provider, provider_id, channel_id, display_name, access_token, refresh_token)
             VALUES ($1, 'youtube', $2, $3, $4, $5, $6)
             ON CONFLICT (user_id, provider)
             DO UPDATE SET 
                provider_id = EXCLUDED.provider_id,
                channel_id = EXCLUDED.channel_id,
                display_name = EXCLUDED.display_name,
                access_token = EXCLUDED.access_token,
                refresh_token = COALESCE(EXCLUDED.refresh_token, social_accounts.refresh_token),
                updated_at = NOW()`,
            [userId, providerId, channelId, displayName, accessToken, refreshToken]
        );
        
        return done(null, req.user);
    } catch (err) {
        return done(err, undefined);
    }
}));

export default passport;
