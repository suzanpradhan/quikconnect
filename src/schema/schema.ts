import { jsonb, uniqueIndex } from 'drizzle-orm/pg-core';
import { bigint, boolean, varchar, uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  resetToken: text('resetToken'),
  resetTokenExpiry: timestamp('resetTokenExpiry'),
  nameUpdateAt: timestamp('nameUpdateAt'),
  phoneNumber: bigint({ mode: 'number' }),
  gender: varchar('gender'),
  avatar: varchar('avatar'),
});

// Chat Table
export const chatTable = pgTable('chat_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name'),
  isGroupChat: boolean('isGroupChat').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Chat Members Table
export const chatMembersTable = pgTable(
  'chat_member',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chatId: uuid('chatId')
      .notNull()
      .references(() => chatTable.id),
    userId: uuid('userId')
      .notNull()
      .references(() => userTable.id),
    receiverId: uuid('receiverId').references(() => userTable.id),
    isAdmin: boolean('isAdmin').default(false),
    memberName: varchar('memberName'),
    creatorName: varchar('creatorName'),
    joinedAt: timestamp('joinedAt').defaultNow(),
  },
  (table) => {
    return {
      uniqueChatUser: uniqueIndex('unique_chat_user').on(table.chatId, table.userId), // Fixed naming for clarity
    };
  },
);

// Message Table
export const messageTable = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chatTable.id),
  senderId: uuid('senderId')
    .notNull()
    .references(() => userTable.id),
  receiverId: uuid('receiverId').references(() => userTable.id), // Optional receiverId
  name: varchar('name').notNull(),
  message: text('message').notNull(),
  messageType: varchar('messageType').default('text'),
  timestamp: timestamp('createdAt').defaultNow(),
  attachmentURL: varchar('attachmentURL'),
  mediaType: varchar('mediaType'),
});

// User-Socket Map Table
export const userSocketMap = pgTable('user_socket_map', {
  userId: text('user_id').primaryKey(),
  socketIds: jsonb('socket_ids').notNull().default([]),
  lastActive: timestamp('last_active').defaultNow(),
});

export const blackListToken = pgTable('black-listed-token', {
  token: varchar('token').notNull().unique().primaryKey(),
  expiry: timestamp('expiry').notNull(),
});
