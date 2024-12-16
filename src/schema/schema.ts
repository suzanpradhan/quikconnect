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

export const chatTable = pgTable('chat-table', {
  //room
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name'),
  isGroupChat: boolean('isGroupChat').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});
export const chatMembersTable = pgTable(
  'chat-member',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chatId: uuid('chatId')
      .notNull()
      .references(() => chatTable.id),
    userId: uuid('userId')
      .notNull()
      .references(() => userTable.id),
    isAdmin: boolean('isAdmin').default(false),
    joinedAt: timestamp('joinedAt').defaultNow(),
  },
  (table) => {
    return {
      uniqueChatUser: uniqueIndex('uniqueChatUser').on(table.chatId, table.userId), // yo le unique key violation detect garerxa, 23505
    };
  },
);

export const messageTable = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chatTable.id),
  senderId: uuid('senderId')
    .notNull()
    .references(() => userTable.id),
  receiverId: uuid('receiverId')
    // .notNull()
    .references(() => userTable.id),
  name: varchar('name').references(() => userTable.name),

  message: text('message').notNull(),
  messageType: varchar('messageType').default('text'),
  createdAt: timestamp('createdAt').defaultNow(),
  attachmentURL: uuid('attachmentURL'),
  mediaType: uuid('mediaType'),
});
export const userSocketMap = pgTable('user_socket_map', {
  userId: text('user_id').primaryKey(),
  socketIds: jsonb('socket_ids').notNull().default([]), 
  lastActive: timestamp('last_active').defaultNow(),
});
