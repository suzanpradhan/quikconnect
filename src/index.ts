import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.route';
import userInfoRoute from './routes/userInfo.route';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';
// import ngrok from '@ngrok/ngrok';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware

app.use('/auth', authRoute);
app.use('/user', userInfoRoute);

app.set('sokeet', io);

setupSwagger(app);

server.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});

// ngrok
//   .connect({
//     port: 8000,
//     authtoken: process.env.NGROK_AUTHTOKEN,
//   })
//   .then((listener) => {
//     console.log(`ngrok tnnel is establishing at: ${listener.url()}/api-docs  you can acces from there`);
//   })
//   .catch((err: any) => {
//     console.log('Error in Ngrok', err);
//   });

export default app;
