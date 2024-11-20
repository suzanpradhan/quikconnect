import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.route';
import userInfoRoute from './routes/userInfo.route';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8000;
let serverUrl = 'http://192.168.1.15:8000/auth';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
    origin: 'http://192.168.1.15:8000',
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware

app.use('/auth', authRoute, userInfoRoute);

app.set('sokeet', io);

setupSwagger(app, serverUrl);

server.listen(PORT, () => {
  console.log(`server is running on port http://192.168.1.15:${PORT}`);
  console.log(`get api from http://192.168.1.15:${PORT}/api-docs`);
});
