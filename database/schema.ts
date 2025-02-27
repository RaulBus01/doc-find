import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
    fullname: text("fullname").unique().notNull(),
    gender: text("gender").notNull(),
    age: text("age").notNull(),
    diabetic: text("diabetic").notNull(),
    hypertensive: text("hypertensive").notNull(),
    smoker: text("smoker").notNull(),
    created_at: integer("created_at").notNull(),
    updated_at: integer("updated_at").notNull(),
});

export type Profile = typeof profiles.$inferSelect;