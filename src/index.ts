import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route';
import userInfoRoute from './routes/userInfo.route';
import chatRoute from './routes/chat.route';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';
import { CONFIG } from './config/dotenvConfig';
import { socketLogic } from './socketLogic';
import { Response } from 'express';

const app = express();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
    // origin: '*',
    origin: ['*', 'https://t44kckcggogwko8sw8s4gkw8.62.72.31.69.sslip.io', CONFIG.BASE_URL, 'https://quickconnect.suzanpradhan.com.np'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware

app.set('socket', io);
socketLogic(io);

app.use('/api', authRoute);
app.use('/api', userInfoRoute);
app.use('/api', chatRoute);

app.get('/health', (req, res: Response) => {
  res.status(200).send('OK');
});
app.get('/api', (req, res: Response) => {
  res.status(200).send(' api OK');
});

setupSwagger(app, `${CONFIG.BASE_URL}/api`);
// setupSwagger(app, `https://quickconnect.suzanpradhan.com.np/api`);

server.listen(CONFIG.PORT, () => {
  console.log(`server is running on ${CONFIG.BASE_URL}`);
  // console.log(`get api from ${CONFIG.BASE_URL}/api-docs`);
  console.log(`get api from https://quickconnect.suzanpradhan.com.np/api-docs`);
});
