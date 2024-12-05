import { signup, signin, forgotPassword, changePassword, logout, createNewPassword } from '../controllers/auth.controller';
import express from 'express';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/createNewPassword', createNewPassword);
authRouter.post('/changePassword', authenticateJWT, changePassword);
authRouter.post('/logout', logout);

export default authRouter;
