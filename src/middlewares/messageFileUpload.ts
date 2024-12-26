import multer from 'multer';
import { CONFIG } from '../config/dotenvConfig';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, CONFIG.UPLOAD_DIR_Messsage);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const fileFilter = (req: any, file: any, cb: any) => {
//   const allowedMimeTypes = ['image/jpg', 'image/png', 'video/mp4', 'application/pdf'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type'), false);
//   }
// };

// export const uploads = multer({
//   storage,
//   fileFilter,
// });

// Multer ko Storage Configuration gareko
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONFIG.UPLOAD_DIR_Messsage); // Dynamically upload directory
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

export const uploads = multer({
  storage,
  fileFilter,
});
