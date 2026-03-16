import { type NextFunction, type Request, type Response } from 'express';
import { createErrorResponse } from '../lib/response.js';
import { findAuthenticatedUserByToken } from '../modules/auth/auth.service.js';

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

  void findAuthenticatedUserByToken(token)
    .then(user => {
      if (!user) {
        return res
          .status(200)
          .json(createErrorResponse('You are not authorized'));
      }

      req.userId = user.id;
      return next();
    })
    .catch(next);
};
