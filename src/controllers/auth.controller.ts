import { UserTable } from '../schema/schema';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { db } from '../migrate';
import { eq } from 'drizzle-orm';
import generateToken from '@/utils/generate.token';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, conformPassword } = req.body;
    if (!name || !email || !password || !conformPassword) {
      res.status(400).json({ Error: 'fill all feilds' });
    }
    if (password.length < 6) {
      return res.status(400).json({ Error: 'Password must be at least 6 characters long' });
    }
    if (password !== conformPassword) {
      return res.status(400).json({ Error: "password don't match! use same password as before" });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    // Validate Gmail format
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ error: 'Please use a valid Gmail address' });
    }

    const checkUserExist = await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1);
    if (checkUserExist.length > 0) {
      // if (!checkUserExist)
      return res.status(400).json({ message: 'mail already exist' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.insert(UserTable).values({
      name,
      email,
      password: hashedPassword,
      conformPassword: hashedPassword,
    });
    if (newUser) {
      res.status(200).json({ message: 'user created' });
    }
  } catch (error) {
    console.error(signup, error);
    res.status(500).json({ message: 'internal server error' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const getUsermail = await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1);
    if (!getUsermail) {
      res.status(400).json({ message: 'invalid credential' });
    }

    const user = getUsermail[0]; // getUsermail ma arry ko form ma basxa data so

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ Message: 'invalid credential' });
    }
    const token = generateToken(user.id, user.email);

    // Return the token in the response body along with user info
    return res.status(200).json({
      message: 'Signin successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
   
  } catch (error: any) {
    console.error('error in controller signin', error);
    return res.status(400).json({ message: 'internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
