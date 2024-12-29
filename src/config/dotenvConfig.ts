// import dotenv from 'dotenv';

// dotenv.config();
// export const CONFIG = {
//   PORT: process.env.PORT || 3000,
//   HOST: process.env.HOST || 'http://192.168.1.9',
//   CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
//   BASE_URL: `${process.env.HOST || 'http://192.168.1.9'}:${process.env.PORT || 3000}`,
//   SWAGGER_PATH: process.env.SWAGGER_PATH || '/api-docs',
//   UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/avatars/',
//   UPLOAD_DIR_Messsage: process.env.UPLOAD_DIR_Messsage || 'uploads/messageFileUploads',

//   MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
//   JWT_SECRET: process.env.JWT_SECRET || 'quickconnectsecretkey',
//   LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Set default logging level
//   EMAIL_USER: process.env.EMAIL_USER,
//   EMAIL_PASS: process.env.EMAIL_PASS,
//   CLIENTRESET_URL: process.env.CLIENTRESET_URL,
//   DATABASE_URL: process.env.DATABASE_URL,
// };

import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'http://localhost',
  BASE_URL: process.env.HOST || 'https://quickconnect.suzanpradhan.com.np',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SWAGGER_PATH: process.env.SWAGGER_PATH || '/api-docs',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/avatars/',
  UPLOAD_DIR_Messsage: process.env.UPLOAD_DIR_Messsage || 'uploads/messageFileUploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'quickconnectsecretkey',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENTRESET_URL: process.env.CLIENTRESET_URL,
  DATABASE_URL: process.env.DATABASE_URL,
};
