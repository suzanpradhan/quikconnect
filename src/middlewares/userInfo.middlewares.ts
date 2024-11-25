import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  //new interface declare gareko tesko name AuthenticatedRequest ra yesma sabai property hunxa jun standard express:Request vako ra additional function, pro[erties add garna milxa like Id:string
  Id?: string; // Add a property to store user ID from the JWT token
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('token in user middleware:', token);

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as { Id: string };

    console.log('Decoded Token:', decoded);
    req.Id = decoded.Id; // Attach the user ID to the request object
    next(); // Proceed to the controller
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
