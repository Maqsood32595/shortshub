
declare module 'passport-youtube-v3' {
  import { Strategy as OAuth2Strategy } from 'passport-oauth2';
  
  export interface Profile {
    id: string;
    displayName: string;
    _json: {
      items: Array<{
        id: string;
        snippet?: {
          title: string;
          description: string;
        };
      }>;
    };
  }
  
  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
    authorizationParams?: {
      access_type?: string;
      prompt?: string;
    };
  }
  
  export interface VerifyFunction {
    (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
  }
  
  export interface VerifyFunctionWithRequest {
    (req: any, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
  }
  
  export class Strategy extends OAuth2Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction | VerifyFunctionWithRequest);
  }
}
