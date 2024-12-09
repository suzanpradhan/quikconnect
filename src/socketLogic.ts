// import { Server, Socket } from 'socket.io';
// import { checkOrCreatePersonalChat, saveMessage } from './services/message.service';
// interface JoinChatPayload {
//   otherUserId: string;
//   userId: string;
// }

// interface SendMessagePayload {
//   chatId: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   messageType: string;
// }

// export const socketLogic = async (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log(`user connected ${socket.id}`);

//     socket.on('joinChat', async ({ userId, otherUserId }: JoinChatPayload) => {
//       try {
//         const { chatId } = await checkOrCreatePersonalChat([userId, otherUserId]);
//         console.log(`User ${userId} and ${otherUserId} joined chat ${chatId}`);
//         socket.join(chatId); // Join the chat room
//       } catch (error) {
//         console.error('Error while checking or creating chat:', error);
//         socket.emit('error', 'Failed to join chat.');
//       }
//     });

//     socket.on('sendMessage', async (data: SendMessagePayload) => {
//       const { chatId, senderId, content, receiverId, messageType } = data;
//       try {
//         await saveMessage(chatId, senderId, receiverId, content, messageType);

//         io.to(chatId).emit('newMessage', {
//           chatId,
//           senderId,
//           content,
//           messageType,
//           createdAt: new Date(),
//         });
//       } catch (error) {
//         console.error('Error while sending message:', error);
//         socket.emit('error', 'Failed to send message.');
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`user disconnect ${socket.id}`);
//     });
//   });
// };

// ............................
import { Server, Socket } from 'socket.io';

interface JoinChatPayload {
  otherUserId: string;
  userId: string;
}

interface SendMessagePayload {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
}

// Map to track userId and their corresponding socket ID
const userSocketMap = new Map<string, string>();

export const socketLogic = async (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected with socket ID: ${socket.id}`);
    });
  });
};
