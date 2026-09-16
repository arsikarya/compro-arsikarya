import { db } from '../db/index.js';
import { activityLogs } from '../db/schema/index.js';
import { desc } from 'drizzle-orm';

export interface LogActionParams {
    userId?: string;
    userName?: string;
    userRole?: string;
    action: string;
    entity: string;
    details?: string;
}

export const activityLogService = {
    async log(params: LogActionParams) {
        try {
            await db.insert(activityLogs).values({
                userId: params.userId || null,
                userName: params.userName || 'Admin',
                userRole: params.userRole || 'ADMIN',
                action: params.action,
                entity: params.entity,
                details: params.details || null,
            });
        } catch (error) {
            console.error('Error recording activity log:', error);
        }
    },

    async getRecentLogs(limit = 20) {
        try {
            return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            return [];
        }
    }
};
