import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function migrate() {
    console.log('🔄 Making inquiries.email nullable and setting default value...');
    await sql`
        ALTER TABLE inquiries ALTER COLUMN email DROP NOT NULL;
    `;
    await sql`
        ALTER TABLE inquiries ALTER COLUMN email SET DEFAULT '-';
    `;
    console.log('✅ inquiries table updated successfully!');
    await sql.end();
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
