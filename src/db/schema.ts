import { varchar } from 'drizzle-orm/pg-core';
import { uuid, pgTable } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
});
