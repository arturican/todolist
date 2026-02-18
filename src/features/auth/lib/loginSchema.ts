import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: 'Login is required' })
    .min(3, { error: 'Login must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(3, { error: 'Password must be at least 3 characters long' }),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});

export type LoginInputs = z.infer<typeof loginSchema>;
