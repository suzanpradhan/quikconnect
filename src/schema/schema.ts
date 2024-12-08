import { uniqueIndex } from 'drizzle-orm/pg-core';
import { bigint, boolean, varchar, uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
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

export const ChatTable = pgTable('ChatTable', {
  //room
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name'),
  isGroupChat: boolean('isGroupChat').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});
export const ChatMembersTable = pgTable(
  'ChatMember',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chatId: uuid('chatId')
      .notNull()
      .references(() => ChatTable.id),
    userId: uuid('userId')
      .notNull()
      .references(() => UserTable.id),
    isAdmin: boolean('isAdmin').default(false),
    joinedAt: timestamp('joinedAt').defaultNow(),
  },
  (table) => {
    return {
      uniqueChatUser: uniqueIndex('uniqueChatUser').on(table.chatId, table.userId), // yo le unique key violation detect garerxa, 23505
    };
  },
);

export const MessageTable = pgTable('Messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => ChatTable.id),
  senderId: uuid('senderId')
    .notNull()
    .references(() => UserTable.id),
  receiverId: uuid('receiverId')
    // .notNull()
    .references(() => UserTable.id),
  message: text('message').notNull(),
  messageType: varchar('messageType').default('text'),
  createdAt: timestamp('createdAt').defaultNow(),
  attachmentURL: uuid('attachmentURL'),
  mediaType: uuid('mediaType'),
});
