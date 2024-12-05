// import express from 'express';
// import cors from 'cors';
// import authRoute from './routes/auth.route';
// import userInfoRoute from './routes/userInfo.route';
// import chatRoute from './routes/chat.route';
// import { Server } from 'socket.io';
// import { setupSwagger } from './swagger';
// import { CONFIG } from './config/dotenvConfig';
// import { socketLogic } from './socketLogic';
// import { instrument } from '@socket.io/admin-ui';
// import fs from 'fs';
// import https from 'https';

// const app = express();

// const sslOptions = {
//   key: fs.readFileSync('server.key'), // Path to your private key
//   cert: fs.readFileSync('server.cert'), // Path to your certificate
// };
// const server = https.createServer(sslOptions, app); //
// const io = new Server(server, {
//   cors: {
//     methods: ['GET', 'POST'],
//     credentials: true,
//     origin: ['https://admin.socket.io', CONFIG.BASE_URL],
//   },
// });

// instrument(io, {
//   auth: false,
//   mode: 'development',
// });

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); //express default middleware

// app.set('socket', io);
// socketLogic(io);

// app.use('/api', authRoute, userInfoRoute);
// app.use('/api', chatRoute);

// setupSwagger(app, `${CONFIG.BASE_URL}/api`);

// server.listen(CONFIG.PORT, () => {
//   console.log(`server is running on ${CONFIG.BASE_URL}`);
//   console.log(`get api from ${CONFIG.BASE_URL}/api-docs`);
// });

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

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
    // origin: '*',
    origin: ['ws://192.168.1.12:8001', CONFIG.BASE_URL],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware

app.set('socket', io);
socketLogic(io);

app.use('/api', authRoute, userInfoRoute);
app.use('/api', chatRoute);

setupSwagger(app, `${CONFIG.BASE_URL}/api`);

server.listen(CONFIG.PORT, () => {
  console.log(`server is running on ${CONFIG.BASE_URL}`);
  console.log(`get api from ${CONFIG.BASE_URL}/api-docs`);
});
