import { AuthenticatedRequest } from '@/middlewares/userInfo.middlewares';
import { ChatTable, ChatMembersTable, MessageTable } from '@/schema/schema';
import { Request, Response } from 'express';
import { db } from '../migrate';
import { eq ,and} from 'drizzle-orm';
import { checkOrCreatePersonalChat } from '@/services/message.service';
import { stringify } from 'querystring';

// const sendMessage = async (req: Request, Request: AuthenticatedRequest, res: Response) => {
//   const { message } = req.body;
//   const id = Request.Id;
//   const { receiverId } = req.params;
//   try {
//   } catch (error) {}
// };

export const chats = async (req: Request, res: Response) => {
  const { Id } = req.params;
  //is like Id=req.Id,Id=req.Id.prams lae userId or chatId part of url jasari rakhxa,kasari vanda route ma /:userID yasari diyasi
  try {
    const chats = await db
      .select()
      .from(ChatTable)
      .innerJoin(ChatMembersTable, eq(ChatMembersTable.chatId, ChatTable.id))
      .where(eq(ChatMembersTable.userId, Id));
    return res.json(chats);
  } catch (error) {
    console.error('error in chat controller', error);
    return res.status(500).json({ mesage: 'intgernal server error' });
  }
};
export const messages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await db.select().from(MessageTable).where(eq(MessageTable.chatId, chatId));
    return res.json(messages);
  } catch (error) {
    console.error('error in chat controller', error);
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const roomDetails = async (req: Request, res: Response) => {
  //chat details
  const { chatId } = req.params;

  try {
    const chat = await db.select().from(ChatTable).where(eq(ChatTable.id, chatId)); // fetch chat
    if (!chat) {
      return res.status(404).json({ message: 'Chat (room) not found' });
    }

    const members = await db.select().from(ChatMembersTable).where(eq(ChatMembersTable.chatId, chatId)); //fetch room
    if (!members) {
      return res.status(404).json({ message: 'Chat member not found' });
    }

    const messages = await db.select().from(MessageTable).where(eq(MessageTable.chatId, chatId));
    if (!messages) {
      return res.status(404).json({ message: 'Chat member not found' });
    }

    return res.json({ chat, members, messages });
  } catch (error) {
    console.error('Error in getRoomDetails controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPersonalChat = async (req: AuthenticatedRequest, res: Response) => {
  const { Id } = req.body; // Get userIds from the request body
  console.log('user Id for personal chat:', Id);
  try {
    if (!Array.isArray(Id) || Id.length !== 2) {
      return res.status(400).json({ error: 'Exactly two user IDs are required for a personal chat.' });
    }

    // Call the service to check or create a personal chat
    const { chatId } = await checkOrCreatePersonalChat(Id);

    // Respond with the chatId
    res.status(200).json({ chatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the chat.' });
  }
};
export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  //request na gare ni hunxa as authenticated request vaneko request lai extend garaya ho
  try {
    const Id = req.Id;
    const { chatName } = req.body;

    const [newChat] = await db //yo new room ko data aaray ma xa so
      .insert(ChatTable)
      .values({
        name: chatName || 'New Room',
        isGroupChat: false,
      })
      .returning(); // Use the .returning() to get the inserted row
    // Send the new room ID back to the client
    await db.insert(ChatMembersTable).values({
      chatId: newChat.id,
      userId: Id as string, // Add the user as a member of the room
      isAdmin: true,
    });

    // Respond with the room ID
    res.status(201).json({
      success: true,
      message: 'Room created and user added successfully!',
      chatId: newChat.id,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room.' });
  }
};

export const joinRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.params;
  const Id = req.Id;

  try {
    // Directly try to insert without checking
    await db.insert(ChatMembersTable).values({
      chatId,
      userId: Id as string,
      isAdmin: false, // Default to member
    });

    res.status(200).json({
      message: 'Successfully joined the room.',
      joinLink: `https://your-app-domain/join-room/${chatId}`,
    });
  } catch (error:any) {
    if (error.code === '23505') {
      return res.status(400).json({
        message: 'User is already a member of this room.',
        joinLink: `https://your-app-domain/join-room/${chatId}`,// yo 2 ota link mathi tala ko lae same kam garxa Client side ma link dynamically render garna milcha.
// If user already member cha, they can still use the provided link to access the room.
      });
    }

    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Failed to join the room.' });
  }
};
