import { db } from '../db/index.js';
import { user, account, session, verification, passwordResetToken } from '../db/schema/index.js';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';

async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER || 'webarsikarya@gmail.com';
    const pass = process.env.SMTP_PASS;

    if (!pass) {
        console.warn(`[EMAIL SKIPPED - NO SMTP_PASS] To: ${to} | Subject: ${subject}`);
        return { sent: false, reason: 'SMTP_PASS not configured' };
    }

    try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        const info = await transporter.sendMail({
            from: `"Arsi Karya CMS" <${user}>`,
            to,
            subject,
            html,
            text,
        });

        console.log(`[EMAIL SENT] To: ${to} | MessageId: ${info.messageId}`);
        return { sent: true, messageId: info.messageId };
    } catch (err: any) {
        console.error('Failed to send email via SMTP:', err);
        return { sent: false, reason: err.message };
    }
}

export const authService = {
    async requestLoginOtp(email: string, password?: string) {
        const cleanEmail = email.toLowerCase().trim();
        const [targetUser] = await db.select().from(user).where(eq(user.email, cleanEmail));

        if (!targetUser || targetUser.status !== 'active') {
            throw new Error('Email atau kata sandi tidak valid');
        }

        // Verify password if provided
        if (password) {
            const [acc] = await db.select().from(account).where(eq(account.userId, targetUser.id));
            if (!acc || !acc.password) {
                throw new Error('Email atau kata sandi tidak valid');
            }

            // @ts-ignore
            const { verifyPassword } = await import('better-auth/crypto');
            const isValid = await verifyPassword({
                password,
                hash: acc.password,
            });

            if (!isValid) {
                throw new Error('Email atau kata sandi tidak valid');
            }
        }

        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const identifier = `login-otp:${cleanEmail}`;

        // Upsert OTP record
        await db.delete(verification).where(eq(verification.identifier, identifier));
        await db.insert(verification).values({
            id: crypto.randomUUID(),
            identifier,
            value: otp,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`\n========================================`);
        console.log(`🔑 [LOGIN OTP CODE] for ${cleanEmail}: ${otp}`);
        console.log(`========================================\n`);

        const html = `
            <div style="max-width: 520px; margin: 0 auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <span style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">ARSI KARYA CMS</span>
                    <h2 style="margin: 14px 0 6px 0; color: #0f172a; font-size: 22px; font-weight: 700;">Kode Verifikasi Masuk Admin</h2>
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Gunakan kode 6 digit berikut untuk menyelesaikan proses login Anda.</p>
                </div>
                
                <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-family: monospace;">${otp}</span>
                    <p style="margin: 10px 0 0 0; color: #ef4444; font-size: 13px; font-weight: 600;">Berlaku selama 10 menit</p>
                </div>

                <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
                    Demi keamanan akun, jangan pernah membagikan kode verifikasi ini kepada siapa pun termasuk pihak yang mengatasnamakan Arsi Karya.
                </p>

                <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
                    Jika Anda tidak merasa melakukan percobaan masuk ke CMS Arsi Karya, harap abaikan email ini atau segera ganti kata sandi Anda.
                </p>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                
                <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} PT. Arsi Karya Unggul &bull; Membangun Tuntas, Unggul Dalam Kualitas
                </div>
            </div>
        `;

        const emailResult = await sendEmail({
            to: cleanEmail,
            subject: `Kode Verifikasi Masuk CMS: ${otp} — Arsi Karya`,
            html,
            text: `Kode verifikasi masuk Admin Arsi Karya Anda adalah: ${otp}. Berlaku selama 10 menit.`,
        });

        const isDev = process.env.NODE_ENV !== 'production' || !process.env.SMTP_PASS;

        return {
            success: true,
            requireOtp: true,
            email: cleanEmail,
            message: emailResult.sent 
                ? `Kode verifikasi telah dikirim ke email ${cleanEmail}`
                : `Kode verifikasi telah dibuat untuk ${cleanEmail}`,
            emailSent: emailResult.sent,
            devOtp: isDev ? otp : undefined,
        };
    },

    async verifyLoginOtp(email: string, otp: string, clientInfo?: { ip?: string; userAgent?: string }) {
        const cleanEmail = email.toLowerCase().trim();
        const cleanOtp = otp.trim();

        const identifier = `login-otp:${cleanEmail}`;

        const [validRecord] = await db.select().from(verification).where(
            and(
                eq(verification.identifier, identifier),
                eq(verification.value, cleanOtp),
                gt(verification.expiresAt, new Date())
            )
        );

        if (!validRecord) {
            throw new Error('Kode verifikasi salah atau telah kedaluwarsa. Silakan minta kode baru.');
        }

        // Single-use: delete immediately
        await db.delete(verification).where(eq(verification.id, validRecord.id));

        const [targetUser] = await db.select().from(user).where(eq(user.email, cleanEmail));
        if (!targetUser || targetUser.status !== 'active') {
            throw new Error('Akun pengguna tidak ditemukan atau tidak aktif');
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await db.insert(session).values({
            id: sessionId,
            token: sessionToken,
            userId: targetUser.id,
            expiresAt,
            ipAddress: clientInfo?.ip || null,
            userAgent: clientInfo?.userAgent || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            success: true,
            token: sessionToken,
            user: {
                id: targetUser.id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role,
            },
            session: {
                id: sessionId,
                token: sessionToken,
                userId: targetUser.id,
                expiresAt,
            }
        };
    },

    async resendLoginOtp(email: string) {
        return this.requestLoginOtp(email);
    },

    async requestPasswordReset(email: string, baseUrl: string) {
        const [targetUser] = await db.select().from(user).where(eq(user.email, email.toLowerCase().trim()));
        if (!targetUser) {
            return { message: 'Jika email terdaftar, instruksi reset kata sandi telah dikirimkan.' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour token validity

        await db.insert(passwordResetToken).values({
            id: crypto.randomUUID(),
            email: targetUser.email,
            token,
            expiresAt,
            used: false,
        });

        const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

        await sendEmail({
            to: targetUser.email,
            subject: 'Reset Kata Sandi Admin — Arsi Karya',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Reset Kata Sandi Admin Arsi Karya</h2>
                    <p>Halo ${targetUser.name},</p>
                    <p>Kami menerima permintaan untuk mereset kata sandi akun Admin Arsi Karya Anda.</p>
                    <p>Klik tombol di bawah ini untuk membuat kata sandi baru (berlaku selama 1 jam):</p>
                    <p style="margin: 24px 0;">
                        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Kata Sandi</a>
                    </p>
                    <p>Atau salin tautan berikut ke peramban Anda:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 0.85rem; color: #777;">Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.</p>
                </div>
            `,
            text: `Tautan reset kata sandi: ${resetUrl}`,
        });

        return {
            message: 'Jika email terdaftar, instruksi reset kata sandi telah dikirimkan.',
            devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
        };
    },

    async verifyAndResetPassword(token: string, newPassword: string) {
        if (!token || !newPassword) {
            throw new Error('Token dan kata sandi baru wajib diisi');
        }

        const [validToken] = await db.select()
            .from(passwordResetToken)
            .where(
                and(
                    eq(passwordResetToken.token, token),
                    eq(passwordResetToken.used, false),
                    gt(passwordResetToken.expiresAt, new Date())
                )
            );

        if (!validToken) {
            throw new Error('Tautan reset kata sandi tidak valid atau telah kedaluwarsa');
        }

        const [targetUser] = await db.select().from(user).where(eq(user.email, validToken.email));
        if (!targetUser) {
            throw new Error('User tidak ditemukan');
        }

        const accounts = await db.select().from(account).where(eq(account.userId, targetUser.id));
        if (accounts.length > 0) {
            // @ts-ignore
            const { hashPassword } = await import('better-auth/crypto');
            const hashedPassword = await hashPassword(newPassword);
            await db.update(account)
                .set({ password: hashedPassword, updatedAt: new Date() })
                .where(eq(account.userId, targetUser.id));
        }

        await db.update(passwordResetToken)
            .set({ used: true })
            .where(eq(passwordResetToken.id, validToken.id));

        return { success: true, message: 'Kata sandi berhasil diperbarui' };
    }
};
