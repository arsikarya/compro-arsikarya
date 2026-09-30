import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './index.js';
import { media } from './schema/media.js';
import { projects } from './schema/project.js';
import { services } from './schema/services.js';
import { articles } from './schema/articles.js';
import { testimonials } from './schema/testimonials.js';
import { siteSettings } from './schema/siteSettings.js';
import { homePage } from './schema/home.js';
import { galleryImages } from './schema/about.js';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webPublicDir = path.resolve(__dirname, '../../../web/public');

const CLOUD_NAME = 'agsidj31';
const UPLOAD_PRESET = 'arsikarya';

async function uploadBufferToCloudinary(buffer: Buffer, mimeType: string, filename: string): Promise<any> {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    const params = new URLSearchParams();
    params.append('file', dataUri);
    params.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Upload failed with status ${res.status}`);
    }
    return data;
}

async function uploadUrlToCloudinary(url: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('file', url);
    params.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Upload failed with status ${res.status}`);
    }
    return data;
}

async function syncAllAssets() {
    console.log('🚀 Starting Cloudinary assets upload and database synchronization...');
    console.log(`Cloud Name: ${CLOUD_NAME}, Preset: ${UPLOAD_PRESET}`);
    console.log(`Web public dir: ${webPublicDir}`);

    const urlMap = new Map<string, string>();

    // 1. Collect files to upload from web/public
    const assetRelativePaths = [
        // Projects
        'projects/project_1.jpg',
        'projects/project_2.jpg',
        'projects/project_3.jpg',
        'projects/project_4.jpg',
        'projects/project_5.jpg',
        'projects/project_6.jpg',
        'projects/project_7.jpg',
        'projects/project_8.jpg',
        'projects/project_9.jpg',
        // Services
        'projects/service_konstruksi.jpg',
        'projects/service_design_build.jpg',
        'projects/service_renovasi.jpg',
        'projects/service_perencanaan.jpg',
        'projects/service_landscape.jpg',
        // Gallery & CTA
        'projects/gallery_1.jpg',
        'projects/gallery_2.jpg',
        'projects/gallery_3.jpg',
        'projects/cta_blueprint.jpg',
        // Images folder
        'images/about-hero.jpg',
        'images/about-showcase.jpg',
        'images/about_collage_1.jpg',
        'images/about_collage_2.jpg',
        'images/about_collage_3.jpg',
        'images/contact-hero.jpg',
        'images/logo-full.png',
        'images/logo-white-badge.png',
        'images/bodal-avatar.png',
        // Root / team
        'hero_banner.jpg',
        'logo.png',
        'team/fachrul_rozi.png'
    ];

    console.log(`\n--- 1. Uploading ${assetRelativePaths.length} local assets to Cloudinary ---`);

    for (const relPath of assetRelativePaths) {
        const fullPath = path.join(webPublicDir, relPath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`  ⚠️ File not found: ${fullPath}`);
            continue;
        }

        const ext = path.extname(relPath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        const buffer = fs.readFileSync(fullPath);

        try {
            console.log(`Uploading ${relPath} (${buffer.length} bytes)...`);
            const cloudData = await uploadBufferToCloudinary(buffer, mimeType, path.basename(relPath));
            const secureUrl = cloudData.secure_url;
            console.log(`  ✓ Uploaded: ${secureUrl}`);

            // Save to media table
            const [savedMedia] = await db.insert(media).values({
                publicId: cloudData.public_id,
                url: secureUrl,
                secureUrl: secureUrl,
                format: cloudData.format || ext.replace('.', ''),
                width: cloudData.width || 0,
                height: cloudData.height || 0,
                bytes: cloudData.bytes || buffer.length,
                folder: cloudData.asset_folder || 'arsikarya',
                altText: path.basename(relPath, ext).replace(/[_-]/g, ' '),
            }).onConflictDoUpdate({
                target: media.publicId,
                set: {
                    url: secureUrl,
                    secureUrl: secureUrl,
                    width: cloudData.width || 0,
                    height: cloudData.height || 0,
                    bytes: cloudData.bytes || buffer.length,
                }
            }).returning();

            // Map both with and without leading slash
            urlMap.set(`/${relPath}`, secureUrl);
            urlMap.set(relPath, secureUrl);
        } catch (err: any) {
            console.error(`  ❌ Failed to upload ${relPath}:`, err.message);
        }
    }

    // 2. Upload Testimonial avatars (Unsplash or external) to Cloudinary
    console.log('\n--- 2. Uploading Testimonial Avatars to Cloudinary ---');
    const allTestimonials = await db.select().from(testimonials);
    for (const item of allTestimonials) {
        if (item.imageUrl && !item.imageUrl.includes('cloudinary.com')) {
            try {
                console.log(`Uploading testimonial avatar for "${item.clientName}"...`);
                const cloudData = await uploadUrlToCloudinary(item.imageUrl);
                const secureUrl = cloudData.secure_url;
                console.log(`  ✓ Uploaded: ${secureUrl}`);

                await db.insert(media).values({
                    publicId: cloudData.public_id,
                    url: secureUrl,
                    secureUrl: secureUrl,
                    format: cloudData.format || 'jpg',
                    width: cloudData.width || 0,
                    height: cloudData.height || 0,
                    bytes: cloudData.bytes || 0,
                    folder: 'arsikarya/testimonials',
                    altText: `Testimoni ${item.clientName}`,
                }).onConflictDoUpdate({
                    target: media.publicId,
                    set: { url: secureUrl, secureUrl: secureUrl }
                });

                await db.update(testimonials)
                    .set({ imageUrl: secureUrl, imageId: cloudData.public_id })
                    .where(eq(testimonials.id, item.id));
                console.log(`  ✓ Updated testimonial ID ${item.id}`);
            } catch (err: any) {
                console.warn(`  ⚠️ Failed to upload avatar for ${item.clientName}:`, err.message);
            }
        }
    }

    // 3. Update Projects in Neon DB
    console.log('\n--- 3. Updating Projects in Neon DB ---');
    const allProjects = await db.select().from(projects);
    for (const proj of allProjects) {
        let newCoverUrl = proj.coverImageUrl;
        if (newCoverUrl && urlMap.has(newCoverUrl)) {
            newCoverUrl = urlMap.get(newCoverUrl)!;
        } else if (newCoverUrl && !newCoverUrl.includes('cloudinary.com')) {
            // Find matched project_x.jpg
            for (const [localPath, cloudUrl] of urlMap.entries()) {
                if (newCoverUrl.endsWith(localPath) || localPath.endsWith(newCoverUrl)) {
                    newCoverUrl = cloudUrl;
                    break;
                }
            }
        }

        // Fallback default if not yet cloudinary
        if (newCoverUrl && !newCoverUrl.includes('cloudinary.com')) {
            const fallbackKey = urlMap.get('/projects/project_1.jpg');
            if (fallbackKey) newCoverUrl = fallbackKey;
        }

        if (newCoverUrl !== proj.coverImageUrl) {
            await db.update(projects)
                .set({ coverImageUrl: newCoverUrl })
                .where(eq(projects.id, proj.id));
            console.log(`  ✓ Project "${proj.title}" updated cover to: ${newCoverUrl}`);
        } else {
            console.log(`  - Project "${proj.title}" already uses Cloudinary: ${proj.coverImageUrl}`);
        }
    }

    // 4. Update Services in Neon DB
    console.log('\n--- 4. Updating Services in Neon DB ---');
    const allServices = await db.select().from(services);
    for (const s of allServices) {
        let newHero = s.heroImageUrl;
        if (newHero && urlMap.has(newHero)) {
            newHero = urlMap.get(newHero)!;
        } else if (newHero && !newHero.includes('cloudinary.com')) {
            for (const [localPath, cloudUrl] of urlMap.entries()) {
                if (newHero.endsWith(localPath) || localPath.endsWith(newHero)) {
                    newHero = cloudUrl;
                    break;
                }
            }
        }

        if (newHero !== s.heroImageUrl) {
            await db.update(services)
                .set({ heroImageUrl: newHero })
                .where(eq(services.id, s.id));
            console.log(`  ✓ Service "${s.title}" updated hero to: ${newHero}`);
        } else {
            console.log(`  - Service "${s.title}" already uses Cloudinary: ${s.heroImageUrl}`);
        }
    }

    // 5. Update Articles in Neon DB
    console.log('\n--- 5. Updating Articles in Neon DB ---');
    const allArticles = await db.select().from(articles);
    for (const art of allArticles) {
        let newCover = art.coverImageUrl;
        if (newCover && urlMap.has(newCover)) {
            newCover = urlMap.get(newCover)!;
        } else if (newCover && !newCover.includes('cloudinary.com')) {
            for (const [localPath, cloudUrl] of urlMap.entries()) {
                if (newCover.endsWith(localPath) || localPath.endsWith(newCover)) {
                    newCover = cloudUrl;
                    break;
                }
            }
        }

        // Fallback to project_2 or project_1 Cloudinary if not matched
        if (newCover && !newCover.includes('cloudinary.com')) {
            const fallback = urlMap.get('/projects/project_2.jpg') || urlMap.get('/projects/project_1.jpg');
            if (fallback) newCover = fallback;
        }

        if (newCover !== art.coverImageUrl) {
            await db.update(articles)
                .set({ coverImageUrl: newCover })
                .where(eq(articles.id, art.id));
            console.log(`  ✓ Article "${art.title}" updated cover to: ${newCover}`);
        } else {
            console.log(`  - Article "${art.title}" already uses Cloudinary: ${art.coverImageUrl}`);
        }
    }

    // 6. Update Site Settings (Logo)
    console.log('\n--- 6. Updating Site Settings in Neon DB ---');
    const [settings] = await db.select().from(siteSettings).limit(1);
    if (settings) {
        let logo = settings.logoUrl;
        if (!logo || !logo.includes('cloudinary.com')) {
            logo = urlMap.get('logo.png') || urlMap.get('images/logo-full.png') || logo;
        }
        let social = settings.socialImageUrl;
        if (!social || !social.includes('cloudinary.com')) {
            social = urlMap.get('hero_banner.jpg') || urlMap.get('projects/project_1.jpg') || social;
        }

        await db.update(siteSettings).set({
            logoUrl: logo,
            socialImageUrl: social,
        }).where(eq(siteSettings.id, settings.id));
        console.log(`  ✓ Site Settings updated: Logo = ${logo}, Social = ${social}`);
    }

    // 7. Verify Media count
    const totalMedia = await db.select().from(media);
    console.log(`\n🎉 SINKRONISASI SELESAI! Total ${totalMedia.length} berkas gambar terdaftar di Media Library Cloudinary & NeonDB!`);
}

syncAllAssets()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal sync error:', err);
        process.exit(1);
    });
