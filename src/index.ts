import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route';
import userInfoRoute from './routes/userInfo.route';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';
import { CONFIG } from './config/dotenvConfig';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
    origin: CONFIG.BASE_URL,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware
app.use('/uploads', express.static(path.resolve(CONFIG.UPLOAD_DIR)));

app.use('/api', authRoute, userInfoRoute);

app.set('sokeet', io);

setupSwagger(app, `${CONFIG.BASE_URL}/api`);

server.listen(CONFIG.PORT, () => {
  console.log(`server is running on ${CONFIG.BASE_URL}`);
  console.log(`get api from ${CONFIG.BASE_URL}/api-docs`);
});
