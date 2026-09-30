import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function migrate() {
    console.log('🔄 Adding testimonial_video_url column to site_settings table...');
    await sql`
        ALTER TABLE site_settings 
        ADD COLUMN IF NOT EXISTS testimonial_video_url TEXT DEFAULT 'https://www.youtube.com/watch?v=sDBl71I37UM';
    `;
    console.log('✅ testimonial_video_url column added/verified successfully!');
    await sql.end();
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
