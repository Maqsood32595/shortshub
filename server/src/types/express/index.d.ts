// This file extends the Express Request interface
// to add properties for our auth and upload middleware.

declare global {
    namespace Express {
        // By augmenting Express.User, we define the shape of `req.user`
        // which is populated by Passport after successful authentication.
        // This avoids conflicts with @types/passport.
        export interface User {
            id: number;
            username?: string;
            email?: string;
        }

        // We no longer need to manually define properties on the Request interface
        // like `user`, `cookies`, `file`, `files`. The corresponding @types
        // packages (@types/passport, @types/cookie-parser, @types/multer)
        // should handle this augmentation correctly. The previous manual
        // declarations were causing type conflicts.
    }
}

// The export {} is necessary to make this file a module and allow augmenting the global namespace.
export {};
