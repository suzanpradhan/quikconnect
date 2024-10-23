import { signup } from '../controllers/auth.controller';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signup', signup);

// authRouter.get('/signup', (req, res) => {
//   res.send('signup route is running');
// });

export default authRouter;
