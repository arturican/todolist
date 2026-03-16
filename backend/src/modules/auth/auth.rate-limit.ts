import rateLimit from 'express-rate-limit';
import { createErrorResponse } from '../../lib/response.js';

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    return res
      .status(429)
      .json(
        createErrorResponse('Too many login attempts. Please try again later.'),
      );
  },
});
