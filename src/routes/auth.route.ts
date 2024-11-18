import { signup, signin, forgotPassword, resetPassword, logout } from '../controllers/auth.controller';
import express from 'express';
import { getAuthenticateUserID } from '@/middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/forgotPassword', getAuthenticateUserID, forgotPassword);
authRouter.post('/resetPassword', getAuthenticateUserID, resetPassword);
authRouter.post('/logout', logout);

export default authRouter;
