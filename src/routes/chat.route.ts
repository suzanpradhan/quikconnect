import express from 'express';
import {
  messages,
  chats,
  roomDetailsOrChatMembers,
  createRoom,
  joinRoom,
  sendMessage,
  deleteMessages,
  createPrivateRoom, 
  sendMultimedia,
} from '../controllers/chat.controller';
import { authenticateJWT } from '@/middlewares/userInfo.middlewares';
import joinRoomLimiter from '@/utils/ratelimit.utills';
import { uploads } from '@/middlewares/messageFileUpload.middleware';
import { validateFileUpload } from '@/middlewares/validateFile.middleware';

const chatRouter = express.Router();

chatRouter.get('/user/:Id', chats); // get all chats for a specific user ,/;userId
chatRouter.get('/:chatId', roomDetailsOrChatMembers); // get all chatmembers
chatRouter.get('/messages/:chatId', messages); // get all messages for a specific chat ,/:chatId lae
chatRouter.post('/create-room', authenticateJWT, createRoom);
chatRouter.post('/create-private-room/:receiverId', authenticateJWT, createPrivateRoom); // :receiverId? yo garo vane receiverId optional hunxa
chatRouter.post('/join-room/:chatId/:receiverId', joinRoom);
chatRouter.post('/send-message/:chatId', authenticateJWT, sendMessage);
chatRouter.post('/send-media/:chatId', authenticateJWT, uploads.array('attachmentURL', 5), validateFileUpload, sendMultimedia);
chatRouter.delete('/delete-messages/:chatId/:messageId', authenticateJWT, deleteMessages);
export default chatRouter;
