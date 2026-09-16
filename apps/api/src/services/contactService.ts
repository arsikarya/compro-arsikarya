import { db } from '../db/index.js';
import { contactPage } from '../db/schema/contact.js';
import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';

export const contactService = {
    async getContactPage() {
        const [page] = await db.select().from(contactPage).limit(1);
        return page || null;
    },

    async updateContactPage(data: {
        whatsappNumber?: string;
        defaultMessage?: string;
        email?: string;
        phone?: string;
        location?: string;
    }) {
        const [existing] = await db.select().from(contactPage).limit(1);

        if (existing) {
            await db.update(contactPage).set({
                whatsappNumber: data.whatsappNumber,
                defaultMessage: data.defaultMessage,
                email: data.email,
                phone: data.phone,
                location: data.location,
                updatedAt: new Date(),
            }).where(eq(contactPage.id, existing.id));
        } else {
            await db.insert(contactPage).values({
                whatsappNumber: data.whatsappNumber,
                defaultMessage: data.defaultMessage,
                email: data.email,
                phone: data.phone,
                location: data.location,
            });
        }

        return this.getContactPage();
    },

    async sendMessage(data: {
        name: string;
        company?: string;
        email: string;
        phone: string;
        cooperationType: string;
        projectType?: string;
        location?: string;
        budget?: string;
        message: string;
        sourcePage?: string;
        submittedAt?: string;
    }) {
        const [page] = await db.select().from(contactPage).limit(1);
        const targetEmail = page?.email || 'webarsikarya@gmail.com';

        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.warn('SMTP_EMAIL or SMTP_PASSWORD not set. Email not actually sent.');
            return { success: true, warning: 'SMTP not configured' };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: targetEmail,
            subject: `Pengajuan Kerja Sama Baru — ${data.name}`,
            text: `
Pengajuan Kerja Sama Baru — Arsi Karya

Nama Lengkap: ${data.name}
Nama Perusahaan / Instansi: ${data.company || '-'}
Email: ${data.email}
Nomor WhatsApp: ${data.phone}
Jenis Kerja Sama: ${data.cooperationType}
Jenis Proyek: ${data.projectType || '-'}
Lokasi Proyek: ${data.location || '-'}
Perkiraan Budget: ${data.budget || '-'}
Pesan / Kebutuhan:
${data.message}

Source Page: ${data.sourcePage || '/kontak'}
Tanggal Pengajuan: ${data.submittedAt || new Date().toLocaleString('id-ID')}
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send email. Please ensure SMTP credentials are correct.');
        }
    }
};
