import { foreignKey,varchar, uuid, pgTable } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  confirmPassword: varchar('confirmPassword').notNull(),
});

