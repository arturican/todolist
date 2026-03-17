import { type NextFunction, type Request, type Response } from 'express';

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown> | unknown;

export const asyncHandler =
  (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
