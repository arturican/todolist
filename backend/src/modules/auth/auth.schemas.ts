import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(3).max(100),
  password: z.string().min(1).max(100),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});

export type LoginBody = z.infer<typeof loginSchema>;
