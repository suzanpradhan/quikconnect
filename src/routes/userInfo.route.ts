import expres from 'express';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import { userInfo } from '../controllers/userInfo.controller';

const userInfoRouter = expres.Router();

userInfoRouter.get('/userInfo', authenticateJWT, userInfo);

export default userInfoRouter;
