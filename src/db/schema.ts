import { varchar, uuid, pgTable } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  pass: varchar('pass').notNull(),
  avter: varchar('avtar', { length: 225 }),
});
