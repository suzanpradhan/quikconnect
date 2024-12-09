import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/messageContent');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

export const uploads = multer({
  storage,
  fileFilter,
});
