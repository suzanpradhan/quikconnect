import { UserTable } from '@/schema/schema';
import bcrypt from 'bcryptjs';
import { Request, response, Response } from 'express';
import { db } from '../migrate';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, conformPassword } = req.body;
    if (!name || !email || !password || !conformPassword) {
      return res.status(400).json({ Error: 'fill all feilds' });
    }
    if (password !== conformPassword) {
      return res.status(400).json({ Error: "password don't match! use same password as before" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.insert(UserTable).values({
      name,
      email,
      password: hashedPassword,
      conformPassword,
    });
    if (newUser) {
      return res.status(200).json({ message: 'user created' });
    }
  } catch (error) {
    console.error(signup, error);
    res.status(500).json({ message: 'internal server error' });
  }
};
