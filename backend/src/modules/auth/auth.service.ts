import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma.js';
import { env } from '../../config/env.js';

export type AuthTokenPayload = {
  userId: number;
};

type AuthUser = {
  id: number;
  email: string;
  login: string;
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
  const expiresIn = rememberMe ? '30d' : env.JWT_EXPIRES_IN;
  return jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn });
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
};
