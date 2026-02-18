import { type NextFunction, type Request, type Response } from 'express';
import { createErrorResponse } from '../lib/response.js';
import { verifyAuthToken } from '../modules/auth/auth.service.js';

const getBearerToken = (headerValue?: string): string | null => {
  if (!headerValue || !headerValue.startsWith('Bearer ')) {
    return null;
  }
  return headerValue.slice('Bearer '.length);
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(200).json(createErrorResponse('You are not authorized'));
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return res.status(200).json(createErrorResponse('You are not authorized'));
  }

  req.userId = payload.userId;
  return next();
};
