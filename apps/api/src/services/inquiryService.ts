import { db } from '../db/index.js';
import { inquiries } from '../db/schema/inquiries.js';
import { eq, desc } from 'drizzle-orm';
import nodemailer from 'nodemailer';

export type InquiryInput = {
    nama: string;
    perusahaan?: string;
    email?: string;
    whatsapp: string;
    jenisKerjasama?: string;
    jenisLayanan?: string;
    jenisProyek?: string;
    lokasi?: string;
    budget?: string;
    pesan?: string;
    sourcePage?: string;
};

export const inquiryService = {
    async listInquiries() {
        return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    },

    async getInquiryById(id: number) {
        const [row] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
        return row || null;
    },

    async createInquiry(data: InquiryInput) {
        // 1. Always save record to NeonDB first
        const [record] = await db.insert(inquiries).values({
            nama: data.nama,
            perusahaan: data.perusahaan || '',
            email: data.email || '-',
            whatsapp: data.whatsapp,
            jenisKerjasama: data.jenisKerjasama || data.jenisLayanan || '',
            jenisProyek: data.jenisProyek || '',
            lokasi: data.lokasi || '',
            budget: data.budget || '',
            pesan: data.pesan || '',
            sourcePage: data.sourcePage || '/kontak',
            status: 'new',
        }).returning();

        // 2. Attempt email notification in background (never fail inquiry creation if email delivery fails)
        this.sendNotificationEmail(record).catch(err => {
            console.error('⚠️ Failed to send inquiry notification email:', err?.message || err);
        });

        return record;
    },

    async updateStatus(id: number, status: string) {
        const [updated] = await db.update(inquiries).set({
            status,
            updatedAt: new Date(),
        }).where(eq(inquiries.id, id)).returning();
        return updated || null;
    },

    async deleteInquiry(id: number) {
        const [deleted] = await db.delete(inquiries).where(eq(inquiries.id, id)).returning();
        return deleted || null;
    },

    async sendNotificationEmail(record: any) {
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const destEmail = process.env.NOTIFICATION_EMAIL || 'arsikaryaunggul@gmail.com';

        if (!smtpHost || !smtpUser || !smtpPass) {
            console.log('ℹ️ SMTP credentials not configured. Inquiry saved to DB without email send.');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const subject = `[Pengajuan Kerja Sama Baru] ${record.nama} - ${record.jenisKerjasama || 'Umum'}`;
        const html = `
            <h2>Pengajuan Kerja Sama Baru — Arsi Karya Website</h2>
            <p><strong>Nama:</strong> ${record.nama}</p>
            <p><strong>Perusahaan/Instansi:</strong> ${record.perusahaan || '-'}</p>
            <p><strong>Email:</strong> ${record.email}</p>
            <p><strong>WhatsApp:</strong> ${record.whatsapp}</p>
            <p><strong>Jenis Kerja Sama:</strong> ${record.jenisKerjasama || '-'}</p>
            <p><strong>Jenis Proyek:</strong> ${record.jenisProyek || '-'}</p>
            <p><strong>Lokasi:</strong> ${record.lokasi || '-'}</p>
            <p><strong>Budget:</strong> ${record.budget || '-'}</p>
            <p><strong>Pesan / Kebutuhan:</strong></p>
            <blockquote style="background: #f4f4f5; padding: 12px; border-left: 4px solid #111;">${record.pesan || '-'}</blockquote>
            <p><small>Waktu Pengajuan: ${new Date(record.createdAt).toLocaleString('id-ID')}</small></p>
        `;

        await transporter.sendMail({
            from: `"Arsi Karya Web" <${smtpUser}>`,
            to: destEmail,
            subject,
            html,
        });
    }
};
