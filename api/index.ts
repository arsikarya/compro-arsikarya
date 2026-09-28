import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../apps/api/src/lib/auth.js';
import { requireAuth } from '../apps/api/src/middleware/requireAuth.js';
import publicRoutes from '../apps/api/src/routes/publicRoutes.js';
import adminRoutes from '../apps/api/src/routes/adminRoutes.js';

const app = express();
// CORS
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Better-Auth-Token'],
    exposedHeaders: ['set-auth-token'],
}));

// Better Auth handler
app.all('/api/auth/*', toNodeHandler(auth));
app.all('/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', requireAuth, adminRoutes);
app.use('/admin', requireAuth, adminRoutes);

app.use('/api', publicRoutes);
app.use('/', publicRoutes);

// Temporary migration endpoint to fix production DB
app.get('/api/debug/migrate', async (_req, res) => {
    try {
        const { db } = await import('../apps/api/src/db/index.js');
        const { sql } = await import('drizzle-orm');
        
        await db.execute(sql`ALTER TABLE contact_page ADD COLUMN IF NOT EXISTS email text;`);
        await db.execute(sql`ALTER TABLE contact_page ADD COLUMN IF NOT EXISTS phone text;`);
        await db.execute(sql`ALTER TABLE contact_page ADD COLUMN IF NOT EXISTS location text;`);
        
        res.json({ success: true, message: 'Database migrated successfully. Columns email, phone, location added.' });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as any)?.message });
    }
});

// Temporary migration endpoint to fix V3 Labs DB
app.get('/api/debug/migrate-labs', async (_req, res) => {
    try {
        const { db } = await import('../apps/api/src/db/index.js');
        const { sql } = await import('drizzle-orm');
        
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS creations (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                image_url TEXT NOT NULL,
                category TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        
        res.json({ success: true, message: 'Database migrated successfully for Labs. creations table ensured.' });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as any)?.message });
    }
});

// Migration endpoint for site_settings dynamic stats & whatsapp CTA
app.get('/api/debug/migrate-settings', async (_req, res) => {
    try {
        const { db } = await import('../apps/api/src/db/index.js');
        const { sql } = await import('drizzle-orm');
        
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_value text DEFAULT '100+';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_label text DEFAULT 'PROYEK SELESAI';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_value text DEFAULT '100%';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_label text DEFAULT 'KOMITMEN MUTU';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_value text DEFAULT '4';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_label text DEFAULT 'LAYANAN SPESIALIS';`);
        await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_cta_text text DEFAULT 'Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.';`);
        
        res.json({ success: true, message: 'Site settings stats and WhatsApp columns ensured.' });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as any)?.message });
    }
});

export default app;
