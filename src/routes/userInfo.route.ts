import express from 'express';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import { edictUserInfo, getAllUser, userInfo } from '../controllers/userInfo.controller';
import { uploadAvatar } from '@/middlewares/fileUpload.middlewares';
import path from 'path';

const userInfoRouter = express.Router();

userInfoRouter.get('/userInfo', authenticateJWT, userInfo);
userInfoRouter.patch('/edictUserInfo', uploadAvatar.single('avatar'), authenticateJWT, edictUserInfo);
userInfoRouter.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
userInfoRouter.get('/allUsers', getAllUser);
export default userInfoRouter;
