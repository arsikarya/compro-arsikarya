import { db } from '../db/index.js';
import { media } from '../db/schema/media.js';
import { projects } from '../db/schema/project.js';
import { services } from '../db/schema/services.js';
import { articles } from '../db/schema/articles.js';
import { testimonials } from '../db/schema/testimonials.js';
import { siteSettings } from '../db/schema/siteSettings.js';
import { eq, desc, or } from 'drizzle-orm';

export type MediaInput = {
    publicId: string;
    url: string;
    secureUrl?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    folder?: string;
    altText?: string;
};

export const mediaService = {
    async listMedia() {
        const items = await db.select().from(media).orderBy(desc(media.createdAt));
        const [allProjects, allServices, allArticles, allTestimonials, [settings]] = await Promise.all([
            db.select({ id: projects.id, title: projects.title, coverImageUrl: projects.coverImageUrl }).from(projects),
            db.select({ id: services.id, title: services.title, heroImageUrl: services.heroImageUrl }).from(services),
            db.select({ id: articles.id, title: articles.title, coverImageUrl: articles.coverImageUrl }).from(articles),
            db.select({ id: testimonials.id, clientName: testimonials.clientName, imageUrl: testimonials.imageUrl }).from(testimonials),
            db.select({ logoUrl: siteSettings.logoUrl, socialImageUrl: siteSettings.socialImageUrl }).from(siteSettings).limit(1),
        ]);

        return items.map(item => {
            const usedBy: string[] = [];
            const matches = (target?: string | null) => {
                if (!target) return false;
                return target === item.url || target === item.secureUrl || target.includes(item.publicId);
            };

            allProjects.forEach(p => {
                if (matches(p.coverImageUrl)) usedBy.push(`Proyek: ${p.title}`);
            });
            allServices.forEach(s => {
                if (matches(s.heroImageUrl)) usedBy.push(`Layanan: ${s.title}`);
            });
            allArticles.forEach(a => {
                if (matches(a.coverImageUrl)) usedBy.push(`Artikel: ${a.title}`);
            });
            allTestimonials.forEach(t => {
                if (matches(t.imageUrl)) usedBy.push(`Testimoni: ${t.clientName}`);
            });
            if (settings && (matches(settings.logoUrl) || matches(settings.socialImageUrl))) {
                usedBy.push('Pengaturan Situs');
            }

            return {
                ...item,
                inUse: usedBy.length > 0,
                usedBy,
            };
        });
    },

    async syncFromCloudinary() {
        const apiKey = process.env.CLOUDINARY_API_KEY || '489481665155635';
        const apiSecret = process.env.CLOUDINARY_API_SECRET || 'Q-AsUqN4I0ErAvbiaOtJCrYWFWQ';
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'agsidj31';

        if (!apiKey || !apiSecret) {
            throw new Error('CLOUDINARY_API_KEY dan CLOUDINARY_API_SECRET belum dikonfigurasi di server backend. Silakan masukkan kredensial API dari dashboard Cloudinary.');
        }

        const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
        let nextCursor: string | undefined = undefined;
        let allResources: any[] = [];

        do {
            const fetchUrl = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`);
            fetchUrl.searchParams.set('max_results', '500');
            if (nextCursor) {
                fetchUrl.searchParams.set('next_cursor', nextCursor);
            }

            const res = await fetch(fetchUrl.toString(), {
                headers: { Authorization: authHeader },
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                throw new Error(data.error?.message || `Gagal mengambil data dari Cloudinary (Status ${res.status})`);
            }

            if (Array.isArray(data.resources)) {
                allResources = allResources.concat(data.resources);
            }
            nextCursor = data.next_cursor;
        } while (nextCursor);

        let syncedCount = 0;

        for (const item of allResources) {
            await db.insert(media).values({
                publicId: item.public_id,
                url: item.secure_url || item.url,
                secureUrl: item.secure_url || item.url,
                format: item.format,
                width: item.width || 0,
                height: item.height || 0,
                bytes: item.bytes || 0,
                folder: item.asset_folder || item.folder || 'arsikarya',
                altText: item.public_id?.split('/').pop()?.replace(/[_-]/g, ' '),
            }).onConflictDoUpdate({
                target: media.publicId,
                set: {
                    url: item.secure_url || item.url,
                    secureUrl: item.secure_url || item.url,
                    width: item.width || 0,
                    height: item.height || 0,
                    bytes: item.bytes || 0,
                }
            });
            syncedCount++;
        }

        return {
            syncedCount,
            totalFound: allResources.length,
        };
    },

    async getMediaById(id: number) {
        const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
        return row || null;
    },

    async createMedia(data: MediaInput) {
        // Upsert by publicId
        const [existing] = await db.select().from(media).where(eq(media.publicId, data.publicId)).limit(1);
        if (existing) {
            return existing;
        }

        const [row] = await db.insert(media).values({
            publicId: data.publicId,
            url: data.url,
            secureUrl: data.secureUrl || data.url,
            format: data.format,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
            folder: data.folder || 'arsikarya',
            altText: data.altText,
        }).returning();
        return row;
    },

    async checkMediaUsage(urlOrId: string) {
        const usage: string[] = [];

        // Check projects
        const matchedProjects = await db.select().from(projects).where(
            or(eq(projects.coverImageUrl, urlOrId), eq(projects.coverImageId, urlOrId))
        );
        if (matchedProjects.length > 0) {
            usage.push(`Proyek (${matchedProjects.length}): ${matchedProjects.map(p => p.title).join(', ')}`);
        }

        // Check services
        const matchedServices = await db.select().from(services).where(
            or(eq(services.heroImageUrl, urlOrId), eq(services.heroImageId, urlOrId))
        );
        if (matchedServices.length > 0) {
            usage.push(`Layanan (${matchedServices.length}): ${matchedServices.map(s => s.title).join(', ')}`);
        }

        // Check articles
        const matchedArticles = await db.select().from(articles).where(
            or(eq(articles.coverImageUrl, urlOrId), eq(articles.coverImageId, urlOrId))
        );
        if (matchedArticles.length > 0) {
            usage.push(`Artikel (${matchedArticles.length}): ${matchedArticles.map(a => a.title).join(', ')}`);
        }

        // Check testimonials
        const matchedTestimonials = await db.select().from(testimonials).where(
            or(eq(testimonials.imageUrl, urlOrId), eq(testimonials.imageId, urlOrId))
        );
        if (matchedTestimonials.length > 0) {
            usage.push(`Testimoni (${matchedTestimonials.length}): ${matchedTestimonials.map(t => t.clientName).join(', ')}`);
        }

        // Check site settings
        const matchedSettings = await db.select().from(siteSettings).where(
            or(eq(siteSettings.logoUrl, urlOrId), eq(siteSettings.socialImageUrl, urlOrId))
        );
        if (matchedSettings.length > 0) {
            usage.push('Pengaturan Website (Logo / Social Image)');
        }

        return usage;
    },

    async deleteMedia(id: number, force: boolean = false) {
        const item = await this.getMediaById(id);
        if (!item) return null;

        const usage = await this.checkMediaUsage(item.url);
        if (usage.length > 0 && !force) {
            throw new Error(`Media sedang digunakan oleh: ${usage.join('; ')}`);
        }

        // Try destroying physical asset on Cloudinary if credentials exist
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'agsidj31';
        const apiKey = process.env.CLOUDINARY_API_KEY || '489481665155635';
        const apiSecret = process.env.CLOUDINARY_API_SECRET || 'Q-AsUqN4I0ErAvbiaOtJCrYWFWQ';

        if (apiKey && apiSecret) {
            try {
                const timestamp = Math.floor(Date.now() / 1000);
                const crypto = await import('crypto');
                const strToSign = `public_id=${item.publicId}&timestamp=${timestamp}${apiSecret}`;
                const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

                const params = new URLSearchParams();
                params.append('public_id', item.publicId);
                params.append('timestamp', timestamp.toString());
                params.append('api_key', apiKey);
                params.append('signature', signature);

                await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString(),
                });
            } catch (cloudErr) {
                console.warn('Could not destroy asset on Cloudinary:', cloudErr);
            }
        }

        const [deleted] = await db.delete(media).where(eq(media.id, id)).returning();
        return deleted || null;
    }
};
