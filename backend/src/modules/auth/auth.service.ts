import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../../db/prisma.js';
import { env } from '../../config/env.js';

export type AuthTokenPayload = {
  userId: number;
  tokenVersion: number;
};

type AuthUser = {
  id: number;
  email: string;
  login: string;
  tokenVersion: number;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

export const createAuthToken = (
  user: AuthUser,
  rememberMe: boolean = false,
): string => {
  const expiresIn: SignOptions['expiresIn'] = rememberMe
    ? '30d'
    : (env.JWT_EXPIRES_IN as SignOptions['expiresIn']);

  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    env.JWT_SECRET,
    { expiresIn },
  );
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
};

export const findAuthenticatedUserByToken = async (
  token: string,
): Promise<AuthUser | null> => {
  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  const user = await findUserById(payload.userId);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    login: user.login,
    tokenVersion: user.tokenVersion,
  };
};

export const revokeUserTokens = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
};
