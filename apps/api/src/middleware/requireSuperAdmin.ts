import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { user } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const authUser = (req as any).user;
        if (!authUser || !authUser.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const [dbUser] = await db.select().from(user).where(eq(user.id, authUser.id));
        if (!dbUser || dbUser.role !== 'SUPER_ADMIN' || dbUser.status !== 'active') {
            res.status(403).json({ error: 'Akses ditolak. Fitur ini hanya untuk Super Admin.' });
            return;
        }

        (req as any).dbUser = dbUser;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
