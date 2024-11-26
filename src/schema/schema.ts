import { bigint, varchar, uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  // confirmPassword: varchar('confirmPassword').notNull(),
  resetToken: text('resetToken'),
  resetTokenExpiry: timestamp('resetTokenExpiry'),
  nameUpdateAt: timestamp('nameUpdateAt'),
  phoneNumber: bigint({ mode: 'number' }),
  gender: varchar('gender'),
  avatar: varchar('avatar'),
});
