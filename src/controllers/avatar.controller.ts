// import { Request, Response } from 'express';
// import { CONFIG } from '../config/dotenvConfig';
// import { UserTable } from '../schema/schema';
// import { AuthenticatedRequest } from '@/middlewares/userInfo.middlewares';
// import { db } from '@/migrate';
// import { eq } from 'drizzle-orm';

// export const updateAvatar = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const avatarFile = req.file;
//     const Id = req.Id;
//     if (!avatarFile) {
//       return res.status(400).json({ message: 'No avatar file uploaded.' });
//     }

//     if (!Id) {
//       return res.status(400).json({ message: 'User ID is required.' });
//     }

//     const avatarUrl = `${CONFIG.UPLOAD_DIR}${avatarFile.filename}`; //avtar url

//     const getUser = await db.select().from(UserTable).where(eq(UserTable.id, Id));
//     if (!getUser || getUser.length === 0) {
//       res.status(400).json({ message: 'user not found' });
//     }
//     await db
//       .update(UserTable)
//       .set({ avatar: avatarUrl })
//       .where(eq(UserTable.id, Id as string))
//       .execute();
//     res.status(200).json({ message: 'Avatar updated successfully.', avatarUrl });
//   } catch (error: any) {
//     console.error('Error in avtar controller', error);
//     res.status(500).json({ message: 'An error occurred while updating the avatar.' });
//   }
// };
