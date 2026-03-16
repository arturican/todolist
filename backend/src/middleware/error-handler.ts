import { type NextFunction, type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { logError } from '../lib/logger.js';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logError('request.failed', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    error: error instanceof Error ? error.message : 'Unknown error',
  });

  return res.status(500).json({
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error instanceof Error
          ? error.message
          : 'Internal server error',
  });
};
