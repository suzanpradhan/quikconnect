import { Request, Response } from 'express';
import { db } from '../migrate';
import { chatMembersTable, chatTable, userTable } from '../schema/schema';
import { AuthenticatedRequest } from '../middlewares/userInfo.middlewares';
import { eq } from 'drizzle-orm';
import { CONFIG } from '@/config/dotenvConfig';
import fs from 'fs';

export const userInfo = async (req: AuthenticatedRequest, res: Response) => {
  const { Id } = req; // Extract user ID from the request object  ra yo middleware bata ako

  if (!Id) {
    return res.status(400).json({ message: 'User ID is required' }); // id token ma attach gqreko xina login garda vane auxa
  }

  try {
    // Fetch the user information from the database using the ID
    const getUser = await db.select().from(userTable).where(eq(userTable.id, Id)); //userTable table ko id ra extract gareko id compare gareko

    if (getUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const getUserChatList = await db
      .select({ chatId: chatTable.id, chatName: chatTable.name })
      .from(chatTable)
      .innerJoin(chatMembersTable, eq(chatMembersTable.chatId, chatTable.id))
      .where(eq(chatMembersTable.userId, Id));

    return res.status(200).json({ userInfo: getUser[0], chatInfo: getUserChatList[0] });
  } catch (error) {
    console.error(userInfo, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const edictUserInfo = async (req: AuthenticatedRequest, res: Response, next: unknown) => {
  const { Id } = req; // Retrieved from middleware
  const { name, phoneNumber, gender } = req.body;
  const avatarFile = req.file as Express.Multer.File;

  if (!Id) {
    return res.status(400).json({ message: 'user not found' });
  }
  try {
    // Fetch the current user
    const user = await db.select().from(userTable).where(eq(userTable.id, Id)).execute();

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const avatarUrl = `${CONFIG.UPLOAD_DIR}${avatarFile.filename}`;
    console.log('avatarurl from controller', avatarUrl);
    await db
      .update(userTable)
      .set({ name, phoneNumber, gender, avatar: avatarUrl })
      .where(eq(userTable.id, Id as string))
      .execute();
    return res.status(200).json({ message: 'Credentials updated successfully.' });
  } catch (error) {
    console.error(edictUserInfo, error);
    try {
      fs.unlinkSync(avatarFile.path);
    } catch (unlinkError) {
      console.error('Failed to delete avatar file:', unlinkError);
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(userTable);
    res.status(200).json({
      message: true,
      users: allUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};
