import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.route';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';
import ngrok from '@ngrok/ngrok';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8000;
let serverUrl = 'http://localhost:8080';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
    origin: 'http://localhost:8080',
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express default middleware

app.use('/auth', authRoute);

app.set('sokeet', io);

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

ngrok
  .connect({
    port: 8000,
    authtoken: process.env.NGROK_AUTHTOKEN,
  })
  .then((listener) => {
    const ngrokUrl = listener.url();
    if (ngrokUrl != null) {
      serverUrl = ngrokUrl;
    }
    console.log(`ngrok tunnel is establishing at: ${listener.url()}/api-docs  you can acces from there`);
    setupSwagger(app, serverUrl);
  })
  .catch((err: any) => {
    console.log('Error in Ngrok', err);
  });

export default app;
