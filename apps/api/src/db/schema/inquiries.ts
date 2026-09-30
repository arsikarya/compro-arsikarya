import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const inquiries = pgTable('inquiries', {
    id: serial('id').primaryKey(),
    nama: text('nama').notNull(),
    perusahaan: text('perusahaan'),
    email: text('email').default('-'),
    whatsapp: text('whatsapp').notNull(),
    jenisKerjasama: text('jenis_kerjasama'),
    jenisProyek: text('jenis_proyek'),
    lokasi: text('lokasi'),
    budget: text('budget'),
    pesan: text('pesan'),
    sourcePage: text('source_page').default('/kontak'),
    status: text('status').notNull().default('new'), // 'new' | 'reviewing' | 'contacted' | 'qualified' | 'closed'
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
