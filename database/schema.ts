import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const profiles = sqliteTable('profiles', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fullname: text("fullname").unique().notNull(),
    gender: text("gender").notNull(),
    age: text("age").notNull(),
    diabetic: text("diabetic").notNull(),
    hypertensive: text("hypertensive").notNull(),
    smoker: text("smoker").notNull(),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
    updated_at: integer("updated_at").notNull().default(sql`(current_timestamp)`),
});

export type Profile = typeof profiles.$inferSelect;
export type ProfileForm = typeof profiles.$inferInsert