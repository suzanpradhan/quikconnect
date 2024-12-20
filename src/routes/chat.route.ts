import express from 'express';
import { messages, chats, roomDetails, createRoom, joinRoom, sendMessage, deleteMessages } from '../controllers/chat.controller';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import joinRoomLimiter from '@/utils/ratelimit.utills';
import { uploads } from '@/middlewares/messageFileUpload';
import { validateFileUpload } from '@/middlewares/validateFile.middleware';

const chatRouter = express.Router();

chatRouter.get('/user/:Id', chats); // get all chats for a specific user ,/;userId
chatRouter.get('/:chatId', roomDetails); // get all chat
chatRouter.get('/messages/:chatId', messages); // get all messages for a specific chat ,/:chatId lae
chatRouter.post('/create-room', authenticateJWT, createRoom);
chatRouter.post('/join-room/:chatId', authenticateJWT, joinRoomLimiter, joinRoom);
chatRouter.post('/send-message/:chatId', authenticateJWT, sendMessage);
chatRouter.post('/deleteMessages/:chatId/:messageId',authenticateJWT,deleteMessages)
chatRouter.post('/deleteMessages/:messageId',deleteMessages)

// chatRouter.post(
//   '/send-message/:chatId/:receiverId?', // receiver id can be null
//   uploads.array('files', 5),
//   validateFileUpload,
//   sendFileMessage,
// );
export default chatRouter;
