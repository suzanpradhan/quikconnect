import { UserTable } from '../schema/schema';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { db } from '../migrate';
import { eq, and, gt } from 'drizzle-orm';
import generateToken from '../utils/generatetoken.utils';
import validator from 'validator';

import { AuthenticatedRequest } from '../middlewares/userInfo.middlewares';
import { sendEmail } from '../utils/email.utills';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ Error: 'fill all feilds' });
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
    // if (validator.isEmail(email)) {
    //   return res.status(400).json({ error: 'Please use a valid Gmail address' });
    // }

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
      return res.status(201).json({ message: 'user created' });
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
      return res.status(400).json({ message: 'invalid credential' });
    }

    const user = getUsermail[0]; // getUsermail ma arry ko form ma basxa data so

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ Message: 'invalid credential' });
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

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

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
  } catch (error) {
    console.error('Error in controller changePassword', error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const user = await db.select().from(UserTable).where(eq(UserTable.email, email)).execute();
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex'); //yesko function:to generate random reset token ,generates 32 random bytes (256 bits) of cryptographically secure random data and convert into hexadecimal string
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000); //after 5 minutes it expirs

    const hashedTokenandtokenExpiry = await db
      .update(UserTable)
      .set({ resetToken: hashedToken as string, resetTokenExpiry: tokenExpiry as Date })
      .where(eq(UserTable.id, user[0].id))
      .execute();
    console.log('hashed token', hashedTokenandtokenExpiry);
    // Send reset token via email
    const resetURL = `${process.env.CLIENTRESET_URL}/reset-password/${resetToken}`;

    // Send reset email
    console.log('reset Url contorller bata ako:', resetURL);
    try {
      sendEmail(
        email,
        'Password Reset Request',
        `You requested a password reset. Click the link below to reset your password: \n\n ${resetURL} \n\nThis link will expire in 5 minutes.`,
      );
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({ message: 'Could not send reset email. Please try again later.' });
    }
    console.log('send email frokm controller', sendEmail);
    return res.status(200).json({
      message: 'Password reset email sent.',
      resetToken: `${resetToken}`,
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
export const createNewPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword, confirmNewPassword } = req.body;

  try {
    // Validate input
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'credentials are required.' });
    }

    // Hash the token to match the one in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find the user by reset token and check expiry
    const user = await db
      .select()
      .from(UserTable)
      .where(
        and(
          eq(UserTable.resetToken, hashedToken), // Check if the hashed token matches
          gt(UserTable.resetTokenExpiry, new Date()), // Check if the token is still valid,reset token bata kun date ma token generate vako dinxa ni new date lae aile ko date ani hamro token expiry time check hunxa ani yesle token validate garxa
        ),
      )
      .execute();

    if (!user || user.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await db
      .update(UserTable)
      .set({ password: hashedPassword, confirmPassword: confirmNewPassword, resetToken: null, resetTokenExpiry: null })
      .where(eq(UserTable.id, user[0].id))
      .execute();

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
