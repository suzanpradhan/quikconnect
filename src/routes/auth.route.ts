import { signup, signin, forgotPassword, resetPassword, logout } from '../controllers/auth.controller';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword', resetPassword);
authRouter.post('/logout', logout);

export default authRouter;
