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
    stat1Value: text('stat1_value').default('100+'),
    stat1Label: text('stat1_label').default('PROYEK SELESAI'),
    stat2Value: text('stat2_value').default('100%'),
    stat2Label: text('stat2_label').default('KOMITMEN MUTU'),
    stat3Value: text('stat3_value').default('4'),
    stat3Label: text('stat3_label').default('LAYANAN SPESIALIS'),
    whatsappCtaText: text('whatsapp_cta_text').default('Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
