import { type NextFunction, type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { logError } from '../lib/logger.js';
import { createErrorResponse } from '../lib/response.js';

type BodyParserError = Error & {
  status?: number;
  type?: string;
};

const isBodyParserError = (error: unknown): error is BodyParserError => {
  return (
    error instanceof Error &&
    typeof (error as BodyParserError).status === 'number' &&
    typeof (error as BodyParserError).type === 'string'
  );
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (
    isBodyParserError(error) &&
    error.status === 400 &&
    error.type === 'entity.parse.failed'
  ) {
    return res.status(400).json(createErrorResponse('Invalid JSON payload'));
  }

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
