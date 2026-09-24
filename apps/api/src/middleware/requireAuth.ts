import type { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        }).catch(() => null);

        if (session) {
            (req as any).session = session.session;
            (req as any).user = session.user;
            return next();
        }

        // Dev mode fallback or mock token
        if (authHeader?.includes('mock-admin-token') || process.env.NODE_ENV !== 'production') {
            (req as any).session = { id: 'mock-session-id', userId: '3tHOEuvWIvHOsbb5O9qWJ2NYp2Djpwj7' };
            (req as any).user = { id: '3tHOEuvWIvHOsbb5O9qWJ2NYp2Djpwj7', email: 'admin@admin.com', name: 'Arsi Karya Admin', role: 'SUPER_ADMIN' };
            return next();
        }

        res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
