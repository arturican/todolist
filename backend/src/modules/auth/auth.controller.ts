import { type Request, type Response } from 'express';
import { loginSchema } from './auth.schemas.js';
import {
  createAuthToken,
  findAuthenticatedUserByToken,
  findUserByEmail,
  revokeUserTokens,
  verifyPassword,
} from './auth.service.js';
import {
  createEmptySuccessResponse,
  createErrorResponse,
  createSuccessResponse,
} from '../../lib/response.js';
import { zodIssuesToFieldErrors } from '../../lib/validation.js';

const getBearerToken = (headerValue?: string): string | null => {
  if (!headerValue || !headerValue.startsWith('Bearer ')) {
    return null;
  }
  return headerValue.slice('Bearer '.length);
};

export const login = async (req: Request, res: Response) => {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedBody.error),
        ),
      );
  }

  const { email, password, rememberMe } = parsedBody.data;
  const user = await findUserByEmail(email);
  if (!user) {
    return res
      .status(200)
      .json(createErrorResponse('Invalid email or password'));
  }

  const isPasswordCorrect = await verifyPassword(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res
      .status(200)
      .json(createErrorResponse('Invalid email or password'));
  }

  const token = createAuthToken(user, rememberMe);
  return res.status(200).json(
    createSuccessResponse({
      userId: user.id,
      token,
    }),
  );
};

export const logout = async (req: Request, res: Response) => {
  const token = getBearerToken(req.headers.authorization);

  if (token) {
    const user = await findAuthenticatedUserByToken(token);
    if (user) {
      await revokeUserTokens(user.id);
    }
  }

  return res.status(200).json(createEmptySuccessResponse());
};

export const me = async (req: Request, res: Response) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(200).json(createErrorResponse('You are not authorized'));
  }

  const user = await findAuthenticatedUserByToken(token);
  if (!user) {
    return res.status(200).json(createErrorResponse('You are not authorized'));
  }

  return res.status(200).json(
    createSuccessResponse({
      id: user.id,
      email: user.email,
      login: user.login,
    }),
  );
};
