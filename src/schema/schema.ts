import { bigint, boolean, varchar, uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  resetToken: text('resetToken'),
  resetTokenExpiry: timestamp('resetTokenExpiry'),
  nameUpdateAt: timestamp('nameUpdateAt'),
  phoneNumber: bigint({ mode: 'number' }),
  gender: varchar('gender'),
  avatar: varchar('avatar'),
});

export const ChatTable = pgTable('ChatTable', {
  id: uuid('id').primaryKey(),
  name: varchar('name'),
  isGroupChat: boolean('isGroupChat').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});
export const ChatMembersTable = pgTable('ChatMember', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => ChatTable.id),
  userId: uuid('userId')
    .notNull()
    .references(() => UserTable.id),
  isAdmin: boolean('isAdmin').default(false),
  joinedAt: timestamp('joinedAt').defaultNow(),
});

export const MessageTable = pgTable('Messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => ChatTable.id),
  senderId: uuid('senderId')
    .notNull()
    .references(() => UserTable.id),
  content: text('content').notNull(),
  messageType: varchar('messageType').default('text'),
  createdAt: timestamp('createdAt').defaultNow(),
});
