import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info', 
  transport:
    process.env.NODE_ENV !== 'production'//production ma =='production' garni
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true, 
          },
        }
      : undefined, 
});

export default logger;


