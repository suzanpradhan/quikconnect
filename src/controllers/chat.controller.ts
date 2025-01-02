import { AuthenticatedRequest } from '@/middlewares/userInfo.middlewares';
import { chatTable, chatMembersTable, messageTable, userTable } from '@/schema/schema';
import { Request, Response } from 'express';
import { db } from '../migrate';
import { eq, and, sql } from 'drizzle-orm';
import { io } from '../index';
import { CONFIG } from '@/config/dotenvConfig';
import { logger } from '@/utils/logger.utills';

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { message } = req.body;
  const senderId = req.Id;
  const { chatId } = req.params;
  try {
    // Fetch sender details from the database
    const senderData = await db
      .select({ senderName: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, senderId as string));

    if (senderData.length === 0) {
      return res.status(404).json({ success: false, message: 'Sender not found.' });
    }

    const { senderName } = senderData[0];
    //     const attachmentUrl = `/uploads/${file.filename}`; // Save file URL
    //  const mediaType = file.mimetype.split('/')[0]; // e.g., 'image', 'video'

    // Save the message in the database
    const newMessage = await db.insert(messageTable).values({
      chatId,
      senderId: senderId as string,
      name: senderName,
      message,
    });
    // Emit the message to all clients in the chat room using Socket.IO
    io.to(chatId).emit('receiveMessage', {
      senderId,
      name: senderName,
      message,
      timestamp: new Date().toISOString(),
    });

    console.log(`Message sent to chat ${chatId} by user ${senderId}`);

    // Return a success response
    return res.status(200).json({
      success: true,
      responseMessage: 'Message sent successfully',
      newMessage: {
        chatId,
        senderId,
        name: senderName,
        message,
      },
      messageContent: newMessage,
    });
  } catch (error) {
    console.error(sendMessage, 'Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMultimedia = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const senderId = req.Id;
    const { chatId } = req.params;

    if (!senderId || !chatId) {
      return res.status(400).json({ success: false, message: 'Sender ID and Chat ID are required.' });
    }

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const files = req.files as Express.Multer.File[]; // Cast req.files to the appropriate type
    const file = files[0]; // Assuming you want to process the first file

    // Retrieve sender name
    const senderData = await db
      .select({ senderName: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, senderId as string));

    if (senderData.length === 0) {
      return res.status(404).json({ success: false, message: 'Sender not found.' });
    }

    const { senderName } = senderData[0];

    // Save file information
    const attachmentUrl = `${CONFIG.UPLOAD_DIR_Messsage}/${file.filename}`;
    logger.debug('Processing attachment', { attachmentUrl, filename: file.filename });
    const mediaType = file.mimetype.split('/')[0]; // Extract media type (e.g., 'image', 'video')

    // Save the message in the database
    const sendFile = await db.insert(messageTable).values({
      attachmentURL: attachmentUrl,
      mediaType,
      message: 'media',
      name: senderName,
      senderId: senderId as string,
      chatId,
    });

    io.to(chatId).emit('receiveMessage', {
      attachmentURL: attachmentUrl,
      mediaType,
      name: senderName,
      message: 'media',
      senderId,
      timestamp: new Date().toISOString(),
    });

    console.log('File uploaded successfully');
    return res.status(200).json({ success: true, fileUploaded: sendFile });
  } catch (error) {
    console.error('Error in sendFileMessage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteMessages = async (req: Request, res: Response) => {
  try {
    const { messageId, chatId } = req.params;

    const [deleteMessage] = await db.delete(messageTable).where(eq(messageTable.id, messageId)).returning();

    io.to(chatId).emit('deleteMessage', {
      chatId,
    });

    console.log('deleted message', deleteMessage);
    return res.status(200).json({ message: 'message delete successfully' });
  } catch (error) {
    console.log('error in deleting message');
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const chats = async (req: Request, res: Response) => {
  const { Id } = req.params;
  //is like Id=req.Id,Id=req.Id.prams lae userId or chatId part of url jasari rakhxa,kasari vanda route ma /:userID yasari diyasi
  try {
    const chats = await db
      .select()
      .from(chatTable)
      .innerJoin(chatMembersTable, eq(chatMembersTable.chatId, chatTable.id))
      .where(eq(chatMembersTable.userId, Id));
    return res.json(chats);
  } catch (error) {
    console.error('error in chat controller', error);
    return res.status(500).json({ mesage: 'intgernal server error' });
  }
};
// export interface Message {
//   id: string;
//   chatId: string;
//   senderId: string;
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface PaginatedMessagesResponse {
//   limit: number;
//   nextCursor: string | null;
//   messages: Message[];
// }
// export const getMessages = async (req: Request, res: Response) => {
//   const { chatId } = req.params;
//   const cursor = req.query.cursor as string | undefined; // Cursor for the last message fetched
//   const limit = Number(req.query.limit) || 10; // Default to 10 messages per fetch if not provided

//   try {
//     let query = db
//       .select({ createdAt: messageTable.createdAt })
//       .from(messageTable)
//       .where(and(eq(messageTable.chatId, chatId), cursor ? sql`${messageTable.createdAt} < ${cursor}` : sql`true`))
//       // cursor ? sql${messageTable.createdAt} < ${cursor} : sqltrue``: This is a conditional (ternary) operator that adds an additional condition based on the presence of the cursor query parameter:
//       // If cursor is defined, it adds the condition sql${messageTable.createdAt} < ${cursor}``. This condition ensures that only messages created before the timestamp specified by cursor are included in the results. This is used for pagination, fetching messages older than the last fetched message.
//       // If cursor is not defined, it adds the condition sql'true'. This is a no-op condition that always evaluates to true, effectively not filtering out any messages based on the createdAt timestamp
//       .limit(limit + 1); // Fetch one extra message to determine if there are more messages

//     const messages = await query;

//     let nextCursor = null;
//     if (messages.length > limit) {
//       const lastMessage = messages.pop(); // Remove the extra message
//       if (lastMessage && lastMessage.createdAt) {
//         nextCursor = lastMessage.createdAt.toISOString(); // Use the createdAt of the last message as the next cursor
//       }
//     }
//     return res.json({
//       limit,
//       nextCursor,
//       messages,
//     });
//   } catch (error) {
//     console.error('error in chat controller', error);
//     return res.status(500).json({ message: 'internal server error' });
//   }
// };
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedMessagesResponse {
  page: number;
  limit: number;
  totalMessages: number;
  totalPages: number;
  messages: string;
}
export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const page = Number(req.query.page) || 1; // Default to page 1 if not provided
  const limit = Number(req.query.limit) || 10; // Default to 10 messages per page if not provided
  const offset = (page - 1) * limit;

  try {
    const [messages] = await db.select().from(messageTable).where(eq(messageTable.chatId, chatId)).offset(offset).limit(limit);

    const totalMessages = await db
      .select({ count: sql`COUNT(*)` })
      .from(messageTable)
      .where(eq(messageTable.chatId, chatId))
      .then((result) => result[0].count);

    const response: PaginatedMessagesResponse = {
      page,
      limit,
      totalMessages: totalMessages as number,
      totalPages: Math.ceil((totalMessages as number) / limit),
      messages: messages as unknown as string,
    };

    return res.json(response);
  } catch (error) {
    console.error('error in chat controller', error);
    return res.status(500).json({ message: 'internal server error' });
  }
};
export const roomDetailsOrChatMembers = async (req: Request, res: Response) => {
  //chat details
  const { chatId } = req.params;
  try {
    const chat = await db.select().from(chatTable).where(eq(chatTable.id, chatId)); // fetch chat
    if (!chat) {
      return res.status(404).json({ message: 'Chat (room) not found' });
    }

    const members = await db.select().from(chatMembersTable).where(eq(chatMembersTable.chatId, chatId)); //fetch room
    if (!members) {
      return res.status(404).json({ message: 'Chat member not found' });
    }

    return res.json({ chat, members });
  } catch (error) {
    console.error('Error in getRoomDetails controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  //request na gare ni hunxa as authenticated request vaneko request lai extend garaya ho
  try {
    const { Id } = req;
    const { chatName } = req.body;

    const [creatorData] = await db
      .select({ name: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, Id as string));

    const [newChat] = await db //yo new room ko data aaray ma xa so
      .insert(chatTable)
      .values({
        name: chatName || 'New Room',
        isGroupChat: true,
      })
      .returning(); // Use the .returning() to get the inserted row
    // Send the new room ID back to the client
    await db.insert(chatMembersTable).values({
      memberName: creatorData.name as unknown as string,
      creatorName: creatorData.name as unknown as string,
      chatId: newChat.id,
      userId: Id as string, // Add the user as a member of the room
      isAdmin: true,
    });
    const joinLink = `${newChat.id}`;
    // Respond with the room ID
    res.status(201).json({
      success: true,
      message: 'Room created and user added successfully!',
      chatId: newChat.id,
      userId: Id as string,
      creatorName: creatorData.name,
      memberName: creatorData.name,
      chatName: chatName,
      joinLink,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room.' });
  }
};

export const joinRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId, receiverId } = req.params;
  // const { Id } = req; // yesle un authorized user lai room join huna bata prevent garxa

  try {
    const [joinData] = await db //add garna la ko member ko data
      .select({ id: userTable.id, name: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, receiverId as string))
      .limit(1);

    if (!joinData) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    // Directly try to insert without checking cause we use code (23505 to track unique key violation so that no duplicate chat will be strored in db
    await db.transaction(async (trx) => {
      await trx.insert(chatMembersTable).values({
        memberName: joinData.name,
        chatId,
        userId: joinData.id,
        isAdmin: false,
      }); //transaction kina use gareko?, yo operation either completely success huxa or completely failed in order to prevent inconsistant state in db
    });
    res.status(200).json({
      joinLink: `${chatId}`,
      joinUserId: joinData.id as string,
      joinUserName: joinData.name,
      message: 'Successfully joined the room.',
    });
  } catch (error: any) {
    if (error.code === '23505') {
      //unique key violate garo vane yo error code auxa 23505 teslai detect
      return res.status(400).json({
        message: 'User is already a member of this room.',
        joinLink: `${chatId}`, // yo 2 ota link mathi tala ko lae same kam garxa Client side ma link dynamically render garna milcha.
        // If user already member cha, they can still use the provided link to access the room.
      });
    }

    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Failed to join the room.' });
  }
};

export const createPrivateRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Id } = req;
    const { receiverId } = req.params;
    const { nickName } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required.' });
    }

    const receiver = await db
      .select({ id: userTable.id, name: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, receiverId))
      .limit(1);

    if (receiver.length === 0) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    //  Check if a private chat already exists between these two users
    const existingChat = await db
      .select({ chatId: chatMembersTable.chatId })
      .from(chatMembersTable)
      .where(and(eq(chatMembersTable.userId, Id as string), eq(chatMembersTable.receiverId, receiverId)))
      .limit(1);

    if (existingChat.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Private room already exists.',
        chatId: existingChat[0].chatId,
      });
    }
    const chatNickName = nickName && nickName.trim() !== '' ? nickName : receiver[0].name;

    // Use a transaction to create the room and add both users
    await db.transaction(async (trx) => {
      // Insert the new chat
      const [newChat] = await trx
        .insert(chatTable)
        .values({
          name: chatNickName, // Default name if chatName is not provided
          isGroupChat: false,
        })
        .returning(); // Return the inserted chat row

      // Add the authenticated user as a member
      await trx.insert(chatMembersTable).values({
        chatId: newChat.id,
        userId: Id as string,
        receiverId: receiverId as string,
        isAdmin: false,
      });

      // Add the receiver as a member
      await trx.insert(chatMembersTable).values({
        chatId: newChat.id,
        userId: receiverId as string,
        receiverId: Id as string,
        isAdmin: false,
      });

      res.status(201).json({
        success: true,
        message: 'Private room created successfully.',
        chatId: newChat.id,
        chatNickName: chatNickName,
        receiverName: receiver[0].name,
      });
    });
  } catch (error: any) {
    if (error.code === '23505') {
      //unique key violate garo vane yo error code auxa 23505 teslai detect
      return res.status(400).json({
        message: 'User is already a member of this room.',
      });
    }

    console.error('Error creating private room:', error);
    res.status(500).json({ message: 'Failed to create private room.' });
  }
};
