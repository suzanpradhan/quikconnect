import rateLimit from 'express-rate-limit';

// Rate limiter configuration: allow max 5 requests per minute per IP
const joinRoomLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute time ma kati request auxa track garxa
  max: 5, // mathi ko 1 min ma ,limit each IP to 5 requests so that spams will be blocked and after 1 min user can try again
  message: { message: 'Too many join attempts. Please try again later.' },
});

export default joinRoomLimiter;
