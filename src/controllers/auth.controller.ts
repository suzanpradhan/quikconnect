import { UserTable } from '../schema/schema';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { db } from '../migrate';
import { eq } from 'drizzle-orm';
import generateToken from '@/utils/generate.token';
import { AuthenticatedRequest } from '@/middlewares/userInfo.middlewares';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({ Error: 'fill all feilds' });
    }
    if (password.length < 6) {
      return res.status(400).json({ Error: 'Password must be at least 6 characters long' });
    }
    if (password != confirmPassword) {
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
      return res.status(401).json({ message: 'mail already exist' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.insert(UserTable).values({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    if (newUser) {
      res.status(201).json({ message: 'user created' });
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
    const token = generateToken(user.id, email);

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

export const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'fill all the fields' });
    }

    const Id = req.Id; // from userInfo middleware, Id ma login gareko user ko token bata extract agareko id
    if (!Id) {
      return res.status(401).json({ message: 'Unauthorized User.' });
    }

    const user = await db.select().from(UserTable).where(eq(UserTable.id, Id)).execute();
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user[0].password); //user[0], user lae arry ma linxa data so yasari gareko or user=user[0] garda ni hunxa
    if (!isOldPasswordMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.update(UserTable).set({ password: hashedPassword, confirmPassword: hashedPassword }).where(eq(UserTable.id, Id)).execute();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {}
};
export const logout = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
  } catch (error) {}
};
