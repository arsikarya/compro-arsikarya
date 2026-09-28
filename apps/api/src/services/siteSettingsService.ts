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
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
    whatsappCtaText?: string;
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
            stat1Value: '100+',
            stat1Label: 'PROYEK SELESAI',
            stat2Value: '100%',
            stat2Label: 'KOMITMEN MUTU',
            stat3Value: '4',
            stat3Label: 'LAYANAN SPESIALIS',
            whatsappCtaText: 'Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.',
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
            stat1Value: data.stat1Value ?? existing.stat1Value,
            stat1Label: data.stat1Label ?? existing.stat1Label,
            stat2Value: data.stat2Value ?? existing.stat2Value,
            stat2Label: data.stat2Label ?? existing.stat2Label,
            stat3Value: data.stat3Value ?? existing.stat3Value,
            stat3Label: data.stat3Label ?? existing.stat3Label,
            whatsappCtaText: data.whatsappCtaText ?? existing.whatsappCtaText,
            updatedAt: new Date(),
        }).where(eq(siteSettings.id, existing.id)).returning();

        return updated;
    }
};
