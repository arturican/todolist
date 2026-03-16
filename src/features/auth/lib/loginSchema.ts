import { z } from 'zod/v4';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { error: 'Username is required' })
    .min(3, { error: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(3, { error: 'Password must be at least 3 characters long' }),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});

export type LoginInputs = z.infer<typeof loginSchema>;
