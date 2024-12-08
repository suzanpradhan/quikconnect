import { ChatMembersTable, ChatTable, MessageTable } from '@/schema/schema';
import { db } from '@/migrate';
import { and, eq, sql } from 'drizzle-orm';

export const saveMessage = async (chatId: string, senderId: string, message: string, receiverId: string, messageType: string) => {
  await db.insert(MessageTable).values({
    chatId,
    senderId,
    receiverId,
    message,
    messageType,
  });
};
export const checkOrCreatePersonalChat = async (userIds: string[]) => {
  console.log('User IDs:', userIds);

  try {
    if (userIds.length !== 2) {
      throw new Error('Personal chat requires exactly two users.');
    }

    // Check if a personal chat already exists between these two users
    const existingChat = await db
      .select({
        chatId: ChatTable.id,
        userCount: sql<number>`COUNT(${ChatMembersTable.userId})`,
      })
      .from(ChatMembersTable)
      .innerJoin(ChatTable, eq(ChatMembersTable.chatId, ChatTable.id))
      .where(
        and(
          eq(ChatTable.isGroupChat, false), // Only consider personal chats
          sql`${ChatMembersTable.userId} = ANY(ARRAY[${userIds.join(', ')}]::text[])`, // Fix: Pass userIds as an array
        ),
      )
      .groupBy(ChatMembersTable.chatId)
      .having(sql`COUNT(${ChatMembersTable.userId}) = 2`); // Ensure exactly two users

    console.log('Existing chat:', existingChat);

    // If a chat already exists, return the chatId
    if (existingChat.length > 0) {
      return { chatId: existingChat[0].chatId };
    }

    // Create a new chat if it doesn't exist
    const newChat = await db
      .insert(ChatTable)
      .values({ name: `${userIds[0]} & ${userIds[1]}`, isGroupChat: false }) // Optional: Set a default name
      .returning({ id: ChatTable.id });

    const chatId = newChat[0].id;
    console.log('New chat created with ID:', chatId);

    // Add the two users as members of the chat
    const chatMembers = userIds.map((userId) => ({
      chatId,
      userId,
      isAdmin: false, // No admin
    }));

    await db.insert(ChatMembersTable).values(chatMembers);
    console.log('Users added to chat:', chatMembers);

    return { chatId }; // Return the newly created chatId
  } catch (error) {
    console.error('Error occurred while checking or creating personal chat:', error);
    throw new Error('An error occurred while processing your request. Please try again later.');
  }
};
