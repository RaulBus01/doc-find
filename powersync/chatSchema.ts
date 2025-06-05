import { DrizzleAppSchema, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const chats = sqliteTable('chats',
  {
    user_id: text('user_id').notNull(),
    title: text('title').notNull(),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull(),
  }
);

export const drizzleSchema = { chats}

export const AppSchema = new DrizzleAppSchema(drizzleSchema)




