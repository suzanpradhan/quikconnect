import { ChatMembersTable, ChatTable, MessageTable } from '@/schema/schema';
import { db } from '@/migrate';

export const saveMessage = async (chatId: string, senderId: string, message: string, receiverId: string, messageType: string) => {
  await db.insert(MessageTable).values({
    chatId,
    senderId,
    receiverId,
    message,
    messageType,
  });
};
