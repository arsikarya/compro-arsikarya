import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const siteSettings = pgTable('site_settings', {
    id: serial('id').primaryKey(),
    companyName: text('company_name').default('Arsi Karya'),
    tagline: text('tagline').default('Membangun Tuntas, Unggul Dalam Kualitas'),
    phone: text('phone').default('+62 899-7932-802'),
    whatsapp: text('whatsapp').default('+62 899-7932-802'),
    email: text('email').default('webarsikarya@gmail.com'),
    address: text('address').default('Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.'),
    instagram: text('instagram').default('arsikarya.build'),
    logoUrl: text('logo_url'),
    seoTitle: text('seo_title').default('Arsi Karya — Kontraktor & Design Build'),
    seoDescription: text('seo_description').default('Kontraktor spesialis Konstruksi, Design & Build, Fabrikasi, dan Pengadaan Barang.'),
    socialImageUrl: text('social_image_url'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
