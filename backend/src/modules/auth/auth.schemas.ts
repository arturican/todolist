import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1).min(3),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});

export type LoginBody = z.infer<typeof loginSchema>;
