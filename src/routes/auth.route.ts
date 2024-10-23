import { signup, signin } from '../controllers/auth.controller';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);

// authRouter.get('/signup', (req, res) => {
//   res.send('signup route is running');
// });

export default authRouter;
