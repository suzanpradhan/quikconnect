import jwt from 'jsonwebtoken';
import { Response } from 'express';
const generateToken = (id: string, res: Response) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 1000, //ms
    httpOnly: true, //it prevent from xss cross site scripting
    sameSite: 'strict', //CSRF attack cross-site request forgery
    secure: process.env.NODE_ENV !== 'development', //HTTP HTTPS
  });
  return token;
};

export default generateToken;
