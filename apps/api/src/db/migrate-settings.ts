import 'dotenv/config';
import { db } from './index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
    console.log('Migrating site_settings table with stats and whatsapp columns...');
    const columns = [
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_value text DEFAULT '100+';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_label text DEFAULT 'PROYEK SELESAI';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_value text DEFAULT '100%';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_label text DEFAULT 'KOMITMEN MUTU';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_value text DEFAULT '4';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_label text DEFAULT 'LAYANAN SPESIALIS';`,
        `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_cta_text text DEFAULT 'Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.';`,
    ];

    for (const query of columns) {
        try {
            await db.execute(sql.raw(query));
            console.log('Executed:', query);
        } catch (err: any) {
            console.error('Error executing query:', query, err?.message);
        }
    }
    console.log('Migration finished successfully!');
    process.exit(0);
}

migrate();
