import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const activityLogs = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: text('user_id'),
    userName: text('user_name').notNull().default('System/Admin'),
    userRole: text('user_role').default('ADMIN'),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    details: text('details'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
