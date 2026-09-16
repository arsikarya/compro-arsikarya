import { db } from '../db/index.js';
import { user, account, passwordResetToken } from '../db/schema/index.js';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';

export const authService = {
    async requestPasswordReset(email: string, baseUrl: string) {
        const [targetUser] = await db.select().from(user).where(eq(user.email, email.toLowerCase().trim()));
        if (!targetUser) {
            // Return success even if user not found to prevent user enumeration
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

        // Attempt sending email via Nodemailer if SMTP configured
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                const nodemailer = await import('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: Number(process.env.SMTP_PORT) === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"Arsi Karya Admin" <${process.env.SMTP_USER || 'webarsikarya@gmail.com'}>`,
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
                });
            } else {
                console.log(`[PASSWORD RESET TOKEN] Email: ${targetUser.email} | URL: ${resetUrl}`);
            }
        } catch (err) {
            console.error('Error sending reset email:', err);
        }

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

        // Hash new password & update account
        const accounts = await db.select().from(account).where(eq(account.userId, targetUser.id));
        if (accounts.length > 0) {
            // @ts-ignore
            const { hashPassword } = await import('better-auth/crypto');
            const hashedPassword = await hashPassword(newPassword);
            await db.update(account)
                .set({ password: hashedPassword, updatedAt: new Date() })
                .where(eq(account.userId, targetUser.id));
        }

        // Mark token as single-use (used)
        await db.update(passwordResetToken)
            .set({ used: true })
            .where(eq(passwordResetToken.id, validToken.id));

        return { success: true, message: 'Kata sandi berhasil diperbarui' };
    }
};
