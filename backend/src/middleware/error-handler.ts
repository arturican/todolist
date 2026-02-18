import { type NextFunction, type Request, type Response } from 'express';
import { env } from '../config/env.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  return res.status(500).json({
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error instanceof Error
          ? error.message
          : 'Internal server error',
  });
};
