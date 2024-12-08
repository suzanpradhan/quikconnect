import express from 'express';
import { messages, chats, roomDetails, createPersonalChat, createRoom, joinRoom, sendMessage } from '../controllers/chat.controller';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import joinRoomLimiter from '@/utils/ratelimit.utills';

const chatRouter = express.Router();

chatRouter.get('/user/:Id', chats); // get all chats for a specific user ,/;userId
chatRouter.get('/:chatId', roomDetails); // get all chat
chatRouter.get('/:chatId/messages', messages); // get all messages for a specific chat ,/:chatId lae
chatRouter.post('/create-personal-chat', authenticateJWT, createPersonalChat);
chatRouter.post('/createRoom', authenticateJWT, createRoom);
chatRouter.post('/join-room/:chatId', authenticateJWT, joinRoomLimiter, joinRoom);
chatRouter.post('/:chatId/sendMessage', authenticateJWT, sendMessage);
export default chatRouter;
