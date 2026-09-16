import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const contactPage = pgTable('contact_page', {
    id: serial('id').primaryKey(),
    whatsappNumber: text('whatsapp_number'),
    email: text('email').default('webarsikarya@gmail.com'),
    phone: text('phone'),
    location: text('location'),
    defaultMessage: text('default_message'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
