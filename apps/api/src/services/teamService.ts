import { db } from '../db/index.js';
import { teamMembers } from '../db/schema/index.js';
import { eq, asc, desc } from 'drizzle-orm';

export const teamService = {
    async listTeamMembers(publicOnly = false) {
        let query = db.select().from(teamMembers);
        if (publicOnly) {
            return await db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.sortOrder), desc(teamMembers.createdAt));
        }
        return await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), desc(teamMembers.createdAt));
    },

    async getTeamMemberById(id: number) {
        const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
        return member || null;
    },

    async createTeamMember(data: any) {
        const [created] = await db.insert(teamMembers).values({
            name: data.name,
            position: data.position,
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || '',
            sortOrder: data.sortOrder ?? 0,
            isActive: data.isActive ?? true,
        }).returning();
        return created;
    },

    async updateTeamMember(id: number, data: any) {
        const [updated] = await db.update(teamMembers)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(teamMembers.id, id))
            .returning();
        return updated || null;
    },

    async deleteTeamMember(id: number) {
        const [deleted] = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
        return deleted || null;
    },

    async reorderTeamMembers(ids: number[]) {
        for (let i = 0; i < ids.length; i++) {
            await db.update(teamMembers).set({ sortOrder: i }).where(eq(teamMembers.id, ids[i]));
        }
    }
};
