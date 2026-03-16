import { randomUUID } from 'node:crypto';
import { type NextFunction, type Request, type Response } from 'express';

const REQUEST_ID_HEADER = 'x-request-id';
const MAX_HEADER_LENGTH = 100;

const normalizeRequestId = (headerValue: string | string[] | undefined) => {
  const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  if (!value) {
    return randomUUID();
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return randomUUID();
  }

  return trimmedValue.slice(0, MAX_HEADER_LENGTH);
};

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = normalizeRequestId(req.headers[REQUEST_ID_HEADER]);

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
