import { relations } from "drizzle-orm/relations";
import { chatTable, messages, user, chatMember } from "./schema";

export const messagesRelations = relations(messages, ({one}) => ({
	chatTable: one(chatTable, {
		fields: [messages.chatId],
		references: [chatTable.id]
	}),
	user_senderId: one(user, {
		fields: [messages.senderId],
		references: [user.id],
		relationName: "messages_senderId_user_id"
	}),
	user_receiverId: one(user, {
		fields: [messages.receiverId],
		references: [user.id],
		relationName: "messages_receiverId_user_id"
	}),
}));

export const chatTableRelations = relations(chatTable, ({many}) => ({
	messages: many(messages),
	chatMembers: many(chatMember),
}));

export const userRelations = relations(user, ({many}) => ({
	messages_senderId: many(messages, {
		relationName: "messages_senderId_user_id"
	}),
	messages_receiverId: many(messages, {
		relationName: "messages_receiverId_user_id"
	}),
	chatMembers_userId: many(chatMember, {
		relationName: "chatMember_userId_user_id"
	}),
	chatMembers_receiverId: many(chatMember, {
		relationName: "chatMember_receiverId_user_id"
	}),
}));

export const chatMemberRelations = relations(chatMember, ({one}) => ({
	chatTable: one(chatTable, {
		fields: [chatMember.chatId],
		references: [chatTable.id]
	}),
	user_userId: one(user, {
		fields: [chatMember.userId],
		references: [user.id],
		relationName: "chatMember_userId_user_id"
	}),
	user_receiverId: one(user, {
		fields: [chatMember.receiverId],
		references: [user.id],
		relationName: "chatMember_receiverId_user_id"
	}),
}));