import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const teamMembers = pgTable('team_members', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    position: text('position').notNull(),
    bio: text('bio').default(''),
    profileImageUrl: text('profile_image_url').default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
