import { Response, NextFunction } from 'express';
export const validateFileUpload = (req: any, res: Response, next: NextFunction) => {
  const files = req.files || [];
  const images = files.filter((file: any) => file.mimetype.startsWith('image/'));
  const videos = files.filter((file: any) => file.mimetype.startsWith('video/'));
  const documents = files.filter((file: any) => file.mimetype === 'application/pdf');

  // Check file limits
  if (files.length > 5) {
    return res.status(400).json({ message: 'You can upload a maximum of 5 files at a time.' });
  }
  if (videos.length > 2) {
    return res.status(400).json({ message: 'You can upload a maximum of 2 videos at a time.' });
  }
  if (documents.length > 1) {
    return res.status(400).json({ message: 'You can upload a maximum of 1 document at a time.' });
  }

  next(); 
};
