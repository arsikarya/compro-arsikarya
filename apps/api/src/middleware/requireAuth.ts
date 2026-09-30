import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { user, session } from '../db/schema/index.js';
import { eq, gt, and } from 'drizzle-orm';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

        if (token) {
            // 1. Direct database session lookup (handles our 2FA OTP issued sessions)
            const [activeSession] = await db.select()
                .from(session)
                .where(and(eq(session.token, token), gt(session.expiresAt, new Date())));

            if (activeSession) {
                const [activeUser] = await db.select().from(user).where(eq(user.id, activeSession.userId));
                if (activeUser && activeUser.status === 'active') {
                    (req as any).session = activeSession;
                    (req as any).user = activeUser;
                    return next();
                }
            }
        }

        // 2. Try Better-Auth built-in getSession
        const betterSession = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        }).catch(() => null);

        if (betterSession) {
            (req as any).session = betterSession.session;
            (req as any).user = betterSession.user;
            return next();
        }

        res.status(401).json({ error: 'Unauthorized: Sesi tidak valid atau telah kedaluwarsa' });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
