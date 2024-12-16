import multer from 'multer';
import { CONFIG } from '../config/dotenvConfig';

// Multer ko Storage Configuration gareko
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONFIG.UPLOAD_DIR); // Dynamically upload directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File Validation (Size & Type)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
    new Error('Only image files are allowed!');
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE }, // Limit file size
});

