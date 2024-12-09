import dotenv from 'dotenv';

dotenv.config();
export const CONFIG = {
  PORT: process.env.PORT || 8001,
  HOST: process.env.HOST || 'http://192.168.1.5',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  BASE_URL: `${process.env.HOST || 'http://192.168.1.5'}:${process.env.PORT || 8001}`,
  SWAGGER_PATH: process.env.SWAGGER_PATH || '/api-docs',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/avatars/',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'quickconnectsecretkey',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Set default logging level
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENTRESET_URL: process.env.CLIENTRESET_URL,
  DATABASE_URL: process.env.DATABASE_URL,
};

// import dotenv from 'dotenv';

// dotenv.config();
// export const CONFIG = {
//   PORT: process.env.PORT || 8001,
//   HOST: process.env.HOST || 'https://localhost',
//   CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
//   BASE_URL: `${process.env.HOST || 'https://localhost'}:${process.env.PORT || 8001}`,
//   SWAGGER_PATH: process.env.SWAGGER_PATH || '/api-docs',
//   UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/avatars/',
//   MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
//   JWT_SECRET: process.env.JWT_SECRET || 'quickconnectsecretkey',
//   LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Set default logging level
//   EMAIL_USER: process.env.EMAIL_USER,
//   EMAIL_PASS: process.env.EMAIL_PASS,
//   CLIENTRESET_URL: process.env.CLIENTRESET_URL,
//   DATABASE_URL: process.env.DATABASE_URL,
// };
