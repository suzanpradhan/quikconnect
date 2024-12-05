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
import { checkOrCreatePersonalChat, saveMessage } from './services/message.service';

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

    // Listen for user identification and map socket ID to user ID
    socket.on('identifyUser', (userId: string) => {
      userSocketMap.set(userId, socket.id);
      console.log(`Mapped userId ${userId} to socket ID ${socket.id}`);
    });

    // Handle joining a chat
    socket.on('joinChat', async ({ userId, otherUserId }: JoinChatPayload) => {
      try {
        const { chatId } = await checkOrCreatePersonalChat([userId, otherUserId]);
        console.log(`User ${userId} and ${otherUserId} joined chat ${chatId}`);
        socket.join(chatId); // Join the chat room
      } catch (error) {
        console.error('Error while checking or creating chat:', error);
        socket.emit('error', 'Failed to join chat.');
      }
    });

    // Handle sending a message
    socket.on('sendMessage', async (data: SendMessagePayload) => {
      const { chatId, senderId, content, receiverId, messageType } = data;
      try {
        await saveMessage(chatId, senderId, receiverId, content, messageType);

        // Emit the new message to the chat room
        io.to(chatId).emit('newMessage', {
          chatId,
          senderId,
          content,
          messageType,
          createdAt: new Date(),
        });

        // Notify the receiver if they are online (i.e., socket ID exists in map)
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notifyMessage', {
            senderId,
            content,
          });
        }
      } catch (error) {
        console.error('Error while sending message:', error);
        socket.emit('error', 'Failed to send message.');
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected with socket ID: ${socket.id}`);

      // Cleanup: Remove the user from the map if their socket ID matches
      for (const [userId, activeSocketId] of userSocketMap.entries()) {
        if (activeSocketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`Removed mapping for userId ${userId}`);
          break;
        }
      }
    });
  });
};
