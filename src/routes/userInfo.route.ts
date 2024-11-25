import expres from 'express';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import { edictUserInfo, userInfo } from '../controllers/userInfo.controller';
import { upload } from '@/middlewares/fileUpload.middlewares';

const userInfoRouter = expres.Router();

userInfoRouter.get('/userInfo', authenticateJWT, userInfo);
userInfoRouter.patch('/edictUserInfo',upload.single('avatar') ,authenticateJWT, edictUserInfo);

export default userInfoRouter;
