import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/social/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // In a real app, save user to database
      const user = {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        provider: 'google'
      };

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// YouTube Strategy (mock for now)
passport.use('youtube', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'mock',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
  callbackURL: "/api/social/youtube/callback",
  scope: ['https://www.googleapis.com/auth/youtube.upload']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Store YouTube access token for user
    const user = {
      youtubeToken: accessToken,
      youtubeRefreshToken: refreshToken
    };

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

export default passport;