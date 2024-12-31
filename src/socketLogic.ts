import { Server } from 'socket.io';
import { db } from './migrate';
import { messageTable,  userTable } from './schema/schema';
import { eq } from 'drizzle-orm';

export const socketLogic = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    // Join a chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    });

    // Listen for the "sendMessage" event
    socket.on('sendMessage', async (data) => {
      const { message, senderId, chatId } = data;

      try {
        // Fetch the sender's name from the database
        const senderData = await db.select({ senderName: userTable.name }).from(userTable).where(eq(userTable.id, senderId));

        if (senderData.length === 0) {
          console.error('Sender not found');
          return;
        }

        const { senderName } = senderData[0];

        // Save the message to the database
        const newMessage = await db.insert(messageTable).values({
          chatId,
          senderId,
          name: senderName,
          message,
        });

        // Emit the message to all clients in the room
        io.to(chatId).emit('receiveMessage', {
          senderId,
          name: senderName,
          message,
          timestamp: new Date().toISOString(),
        });

        console.log(`Message sent to chat ${chatId} by user ${senderId}`);
      } catch (error) {
        console.error('Error handling sendMessage:', error);
      }
    });
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

// import { Server } from 'socket.io';

// const activeUsers = new Map();

// export const socketLogic = (io: Server) => {
//   io.on('connection', (socket) => {
//     console.log(`User connected with socket ID: ${socket.id}`);
//     const userId = socket.handshake.query.userId;

//     if (activeUsers.has(userId)) {
//       socket.disconnect(true);
//       console.log(`Duplicate connection detected for user: ${userId}`);
//     } else {
//       activeUsers.set(userId, socket.id);
//       socket.on('disconnect', () => activeUsers.delete(userId));
//     }

//     // Join a chat room
//     socket.on('joinChat', (chatId) => {
//       socket.join(chatId);
//       console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
//     });

//     // Handle user disconnect
//     socket.on('disconnect', () => {
//       console.log(`User with socket ID ${socket.id} disconnected`);
//     });
//   });
// };
