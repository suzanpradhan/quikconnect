import { pgTable, varchar, timestamp, foreignKey, uuid, text, boolean, jsonb, uniqueIndex, unique, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const blackListedToken = pgTable("black-listed-token", {
	token: varchar().primaryKey().notNull(),
	expiry: timestamp({ mode: 'string' }).notNull(),
});

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	senderId: uuid().notNull(),
	receiverId: uuid(),
	name: varchar().notNull(),
	message: text().notNull(),
	messageType: varchar().default('text'),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	attachmentUrl: varchar(),
	mediaType: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chatTable.id],
			name: "messages_chatId_chat_table_id_fk"
		}),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [user.id],
			name: "messages_senderId_user_id_fk"
		}),
	foreignKey({
			columns: [table.receiverId],
			foreignColumns: [user.id],
			name: "messages_receiverId_user_id_fk"
		}),
]);

export const chatTable = pgTable("chat_table", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar(),
	isGroupChat: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
});

export const userSocketMap = pgTable("user_socket_map", {
	userId: text("user_id").primaryKey().notNull(),
	socketIds: jsonb("socket_ids").default([]).notNull(),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow(),
});

export const chatMember = pgTable("chat_member", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	userId: uuid().notNull(),
	receiverId: uuid(),
	isAdmin: boolean().default(false),
	memberName: varchar(),
	creatorName: varchar(),
	joinedAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("unique_chat_user").using("btree", table.chatId.asc().nullsLast().op("uuid_ops"), table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chatTable.id],
			name: "chat_member_chatId_chat_table_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "chat_member_userId_user_id_fk"
		}),
	foreignKey({
			columns: [table.receiverId],
			foreignColumns: [user.id],
			name: "chat_member_receiverId_user_id_fk"
		}),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar().notNull(),
	resetToken: text(),
	resetTokenExpiry: timestamp({ mode: 'string' }),
	nameUpdateAt: timestamp({ mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	phoneNumber: bigint({ mode: "number" }),
	gender: varchar(),
	avatar: varchar(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);
