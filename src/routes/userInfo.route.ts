import expres from 'express';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import { edictUserInfo, userInfo } from '../controllers/userInfo.controller';

const userInfoRouter = expres.Router();

userInfoRouter.get('/userInfo', authenticateJWT, userInfo);
userInfoRouter.put('/edictUserInfo', authenticateJWT, edictUserInfo);

export default userInfoRouter;
