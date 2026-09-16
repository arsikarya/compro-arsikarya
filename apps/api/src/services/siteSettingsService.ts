import { db } from '../db/index.js';
import { siteSettings } from '../db/schema/siteSettings.js';
import { eq } from 'drizzle-orm';

export type SiteSettingsInput = {
    companyName?: string;
    tagline?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    instagram?: string;
    logoUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    socialImageUrl?: string;
};

export const siteSettingsService = {
    async getSettings() {
        const [existing] = await db.select().from(siteSettings).limit(1);
        if (existing) return existing;

        // Fallback default row
        const [inserted] = await db.insert(siteSettings).values({
            companyName: 'Arsi Karya',
            tagline: 'Membangun Tuntas, Unggul Dalam Kualitas',
            phone: '+62 899-7932-802',
            whatsapp: '+62 899-7932-802',
            email: 'webarsikarya@gmail.com',
            address: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.',
            instagram: 'arsikarya.build',
            seoTitle: 'Arsi Karya — Kontraktor & Design Build',
            seoDescription: 'Kontraktor spesialis Konstruksi, Design & Build, Fabrikasi, dan Pengadaan Barang.',
        }).returning();
        return inserted;
    },

    async updateSettings(data: SiteSettingsInput) {
        const existing = await this.getSettings();

        const [updated] = await db.update(siteSettings).set({
            companyName: data.companyName ?? existing.companyName,
            tagline: data.tagline ?? existing.tagline,
            phone: data.phone ?? existing.phone,
            whatsapp: data.whatsapp ?? existing.whatsapp,
            email: data.email ?? existing.email,
            address: data.address ?? existing.address,
            instagram: data.instagram ?? existing.instagram,
            logoUrl: data.logoUrl ?? existing.logoUrl,
            seoTitle: data.seoTitle ?? existing.seoTitle,
            seoDescription: data.seoDescription ?? existing.seoDescription,
            socialImageUrl: data.socialImageUrl ?? existing.socialImageUrl,
            updatedAt: new Date(),
        }).where(eq(siteSettings.id, existing.id)).returning();

        return updated;
    }
};
