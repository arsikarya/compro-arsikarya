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

interface AttemptTracker {
    attempts: number;
    lockedUntil: number | null;
}

const loginAttempts = new Map<string, AttemptTracker>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const authService = {
    // Direct Secure Login with Brute-Force Lockout Protection
    async loginWithPassword(email: string, password: string, clientInfo?: { ip?: string; userAgent?: string }) {
        const cleanEmail = email.toLowerCase().trim();
        const clientIp = clientInfo?.ip || 'unknown';
        const rateKey = `${cleanEmail}_${clientIp}`;

        // Check if IP/Email is temporarily locked out
        const tracker = loginAttempts.get(rateKey);
        if (tracker && tracker.lockedUntil) {
            if (tracker.lockedUntil > Date.now()) {
                const remainingMinutes = Math.ceil((tracker.lockedUntil - Date.now()) / (60 * 1000));
                throw new Error(`Terlalu banyak percobaan login gagal. Akun dikunci sementara selama ${remainingMinutes} menit demi keamanan.`);
            } else {
                loginAttempts.delete(rateKey);
            }
        }

        const [targetUser] = await db.select().from(user).where(eq(user.email, cleanEmail));

        const recordFailure = async () => {
            const current = loginAttempts.get(rateKey) || { attempts: 0, lockedUntil: null };
            current.attempts += 1;
            if (current.attempts >= MAX_FAILED_ATTEMPTS) {
                current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
                const { activityLogService } = await import('./activityLogService.js');
                await activityLogService.log({
                    userId: targetUser?.id,
                    userName: targetUser?.name || 'Unknown',
                    userRole: targetUser?.role || 'UNKNOWN',
                    action: 'LOGIN_TERKUNCI',
                    entity: 'Auth',
                    details: `Akun dikunci 15 menit karena 5x salah password dari IP ${clientIp} (${cleanEmail})`,
                });
            }
            loginAttempts.set(rateKey, current);
        };

        if (!targetUser || targetUser.status !== 'active') {
            await recordFailure();
            throw new Error('Email atau kata sandi tidak valid');
        }

        const [acc] = await db.select().from(account).where(eq(account.userId, targetUser.id));
        if (!acc || !acc.password) {
            await recordFailure();
            throw new Error('Email atau kata sandi tidak valid');
        }

        // @ts-ignore
        const { verifyPassword } = await import('better-auth/crypto');
        const isValid = await verifyPassword({
            password,
            hash: acc.password,
        });

        if (!isValid) {
            await recordFailure();
            const current = loginAttempts.get(rateKey);
            const remainingAttempts = MAX_FAILED_ATTEMPTS - (current?.attempts || 0);
            if (remainingAttempts > 0) {
                throw new Error(`Email atau kata sandi salah. Sisa kesempatan: ${remainingAttempts} kali.`);
            } else {
                throw new Error('Terlalu banyak percobaan login gagal. Akun dikunci sementara selama 15 menit demi keamanan.');
            }
        }

        // Successful login: reset failed attempts counter
        loginAttempts.delete(rateKey);

        // Generate 256-bit cryptographically secure session token
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

        // Audit Log
        const { activityLogService } = await import('./activityLogService.js');
        await activityLogService.log({
            userId: targetUser.id,
            userName: targetUser.name,
            userRole: targetUser.role,
            action: 'LOGIN_SUKSES',
            entity: 'Auth',
            details: `Admin ${targetUser.name} (${cleanEmail}) berhasil login dari IP ${clientIp}`,
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

    async requestPasswordReset(email: string, baseUrl?: string) {
        const cleanEmail = email.toLowerCase().trim();
        const [targetUser] = await db.select().from(user).where(eq(user.email, cleanEmail));
        if (!targetUser) {
            return {
                success: true,
                message: 'Jika email terdaftar, tautan pemulihan kata sandi telah dikirimkan ke kotak masuk email Anda.',
            };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour token validity

        // Invalidate any previous unused tokens for this email
        await db.delete(passwordResetToken).where(eq(passwordResetToken.email, cleanEmail));

        await db.insert(passwordResetToken).values({
            id: crypto.randomUUID(),
            email: targetUser.email,
            token,
            expiresAt,
            used: false,
        });

        // Determine frontend URL so the email link navigates directly to the web client
        let resolvedBase = baseUrl || '';
        if (!resolvedBase || resolvedBase.includes(':3001')) {
            resolvedBase = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://arsikarya.id' : 'http://localhost:5173');
        }
        resolvedBase = resolvedBase.replace(/\/+$/, '');

        const resetUrl = `${resolvedBase}/admin/reset-password?token=${token}`;

        const html = `
            <div style="max-width: 540px; margin: 0 auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <span style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">ARSI KARYA CMS</span>
                    <h2 style="margin: 14px 0 6px 0; color: #0f172a; font-size: 22px; font-weight: 700;">Atur Ulang Kata Sandi Akun</h2>
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Permintaan pemulihan akses administrator</p>
                </div>
                
                <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                    Halo <strong>${targetUser.name}</strong>,
                </p>
                <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                    Kami menerima permintaan untuk mengatur ulang kata sandi akun Admin Arsi Karya Anda (<strong>${targetUser.email}</strong>). Silakan klik tombol di bawah ini untuk membuat kata sandi baru:
                </p>

                <div style="text-align: center; margin: 28px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                        Atur Ulang Kata Sandi Sekarang &rarr;
                    </a>
                    <p style="margin: 10px 0 0 0; color: #ef4444; font-size: 12px; font-weight: 600;">Tautan ini hanya berlaku selama 1 jam</p>
                </div>

                <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 8px 0;">
                    Atau salin dan tempel tautan berikut di peramban (browser) Anda:
                </p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; word-break: break-all; font-size: 12px; color: #2563eb; font-family: monospace; margin-bottom: 24px;">
                    <a href="${resetUrl}" style="color: #2563eb; text-decoration: underline;">${resetUrl}</a>
                </div>

                <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 16px 0;">
                    <strong>Keamanan:</strong> Jika Anda tidak pernah mengajukan permintaan ini, abaikan email ini. Akun Anda tetap aman dan kata sandi Anda tidak akan berubah tanpa akses ke email ini.
                </p>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                
                <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} PT. Arsi Karya Unggul &bull; Membangun Tuntas, Unggul Dalam Kualitas
                </div>
            </div>
        `;

        await sendEmail({
            to: targetUser.email,
            subject: 'Tautan Pemulihan Kata Sandi Akun — Arsi Karya',
            html,
            text: `Halo ${targetUser.name}, silakan buka tautan berikut untuk mengatur ulang kata sandi Anda: ${resetUrl} (Berlaku 1 jam). Jika bukan Anda yang meminta, abaikan email ini.`,
        });

        console.log(`\n========================================`);
        console.log(`📬 [PASSWORD RESET] Permintaan reset untuk ${cleanEmail}`);
        if (!process.env.SMTP_PASS) {
            console.log(`⚠️  [DEV LOG ONLY] SMTP_PASS belum diset di .env.`);
            console.log(`🔗 Link Reset (HANYA di log server backend): ${resetUrl}`);
        } else {
            console.log(`✅ Email berhasil dikirim via SMTP ke ${cleanEmail}`);
        }
        console.log(`========================================\n`);

        // Strictly return NO token and NO url in the HTTP response
        return {
            success: true,
            message: `Tautan pemulihan kata sandi telah dikirimkan ke email ${targetUser.email}. Silakan periksa kotak masuk atau spam email Anda.`,
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
