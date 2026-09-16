import { db } from '../db/index.js';
import { user, account } from '../db/schema/index.js';
import { eq, count, and } from 'drizzle-orm';
import { auth } from '../lib/auth.js';

export const userService = {
    async listUsers() {
        const usersList = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }).from(user);
        return usersList;
    },

    async getUserById(id: string) {
        const [u] = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }).from(user).where(eq(user.id, id));
        return u || null;
    },

    async countSuperAdmins() {
        const [result] = await db.select({ count: count() })
            .from(user)
            .where(and(eq(user.role, 'SUPER_ADMIN'), eq(user.status, 'active')));
        return Number(result?.count || 0);
    },

    async createUser(data: { name: string; email: string; password?: string; role?: string; status?: string }) {
        const existing = await db.select().from(user).where(eq(user.email, data.email));
        if (existing.length > 0) {
            throw new Error('User dengan email ini sudah terdaftar');
        }

        const role = data.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
        const status = data.status === 'inactive' ? 'inactive' : 'active';
        const password = data.password || 'Arsikarya123!';

        // Create user via Better-Auth
        const createdUser = await auth.api.signUpEmail({
            body: {
                name: data.name,
                email: data.email,
                password,
            }
        });

        if (!createdUser || !createdUser.user) {
            throw new Error('Gagal membuat user baru');
        }

        // Update role and status
        await db.update(user)
            .set({ role, status, updatedAt: new Date() })
            .where(eq(user.id, createdUser.user.id));

        return {
            id: createdUser.user.id,
            name: data.name,
            email: data.email,
            role,
            status,
        };
    },

    async updateUserRoleOrStatus(id: string, data: { role?: string; status?: string; name?: string }) {
        const targetUser = await this.getUserById(id);
        if (!targetUser) {
            throw new Error('User tidak ditemukan');
        }

        // Check last SUPER_ADMIN protection
        if (targetUser.role === 'SUPER_ADMIN') {
            const superAdminCount = await this.countSuperAdmins();
            if (superAdminCount <= 1) {
                if (data.role && data.role !== 'SUPER_ADMIN') {
                    throw new Error('Tidak dapat mengubah peran Super Admin terakhir!');
                }
                if (data.status && data.status === 'inactive') {
                    throw new Error('Tidak dapat menonaktifkan Super Admin terakhir!');
                }
            }
        }

        const updatePayload: any = { updatedAt: new Date() };
        if (data.name) updatePayload.name = data.name;
        if (data.role) updatePayload.role = data.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
        if (data.status) updatePayload.status = data.status === 'inactive' ? 'inactive' : 'active';

        await db.update(user).set(updatePayload).where(eq(user.id, id));
        return await this.getUserById(id);
    },

    async resetUserPassword(id: string, newPassword?: string) {
        const targetUser = await this.getUserById(id);
        if (!targetUser) {
            throw new Error('User tidak ditemukan');
        }

        const passwordToSet = newPassword || 'Arsikarya123!';
        
        // Update password in account table for better-auth
        // Hash password or update account record
        const accounts = await db.select().from(account).where(eq(account.userId, id));
        if (accounts.length > 0) {
            // Use Better-Auth password hashing / update
            // @ts-ignore
            const { hashPassword } = await import('better-auth/crypto');
            const hashedPassword = await hashPassword(passwordToSet);
            await db.update(account).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(account.userId, id));
        }

        return { success: true, newPassword: passwordToSet };
    },

    async deleteUser(id: string) {
        const targetUser = await this.getUserById(id);
        if (!targetUser) {
            throw new Error('User tidak ditemukan');
        }

        if (targetUser.role === 'SUPER_ADMIN') {
            const superAdminCount = await this.countSuperAdmins();
            if (superAdminCount <= 1) {
                throw new Error('Tidak dapat menghapus Super Admin terakhir!');
            }
        }

        await db.delete(user).where(eq(user.id, id));
        return { success: true, deletedUser: targetUser };
    }
};
