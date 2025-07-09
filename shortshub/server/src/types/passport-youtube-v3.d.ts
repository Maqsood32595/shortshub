// src/types/passport-youtube-v3.d.ts

declare module 'passport-youtube-v3' {
    import { Strategy as PassportStrategy } from 'passport-strategy';
    import { Request } from 'express';

    interface Profile {
        provider: string;
        id: string;
        displayName: string;
        // Add other properties you expect from the YouTube profile
        _raw: string;
        _json: any;
    }

    interface VerifyCallback {
        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void): void;
    }

    interface StrategyOptions {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        scope?: string[];
        passReqToCallback?: boolean;
    }

    class Strategy extends PassportStrategy {
        constructor(options: StrategyOptions, verify: VerifyCallback);
        // Add any other methods you might directly call on the Strategy instance
    }
}
