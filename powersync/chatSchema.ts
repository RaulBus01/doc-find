import { DrizzleAppSchema, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const chats = sqliteTable('chats',
  {
    user_id: text('user_id').notNull(),
    title: text('title').notNull(),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull(),
  },
  (table) => [
   index('user_id_idx').on(table.user_id),
  ]
);
  
export const checkpoints = sqliteTable('checkpoints',
  {
    thread_id: text('thread_id').notNull(),
    metadata: text('metadata').notNull(),
  },
   (table) => [
    index('thread_id_idx').on(table.thread_id),
   ]
);
export const drizzleSchema = { chats, checkpoints }


export const AppSchema = new DrizzleAppSchema(drizzleSchema)




