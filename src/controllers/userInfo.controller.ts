import { Request, Response } from 'express';
import { db } from '../migrate';
import { UserTable } from '../schema/schema';

export const userInfo = async (req: Request, res: Response) => {
  const Id = (req as any).id;
  console.log('id', Id);
  if (!Id) {
    res.status(400).json({ message: 'user id is required' });
  }

  try {
    const getUser = await db.select().from(UserTable).where(Id);

    if (!getUser) {
      res.status(404).json({ message: 'user not found' });
    } else {
      res.status(200).json({ getUser });
    }
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
    console.error('error fetching user information', error);
  }
};
