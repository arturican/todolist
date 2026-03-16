import 'dotenv/config';
import { z } from 'zod';

const parseTrustProxy = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (
    normalizedValue === '' ||
    normalizedValue === '0' ||
    normalizedValue === 'false' ||
    normalizedValue === 'no' ||
    normalizedValue === 'off'
  ) {
    return false;
  }

  if (
    normalizedValue === '1' ||
    normalizedValue === 'true' ||
    normalizedValue === 'yes' ||
    normalizedValue === 'on'
  ) {
    return 1;
  }

  return value;
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_ORIGIN: z.string().default('http://localhost:3000'),
  TRUST_PROXY: z.string().default('false').transform(parseTrustProxy),
  REQUEST_BODY_LIMIT: z.string().default('32kb'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(12),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid backend environment configuration: ${parsedEnv.error.message}`,
  );
}

export const env = parsedEnv.data;

export const frontendOrigins = env.FRONTEND_ORIGIN.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
