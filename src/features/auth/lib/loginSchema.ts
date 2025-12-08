import { z } from 'zod/v4';

export type LoginInputs = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
  email: z.email({ error: 'Incorrect email address' }),
  password: z.string().min(8, { message: 'Short password' }),
  rememberMe: z.boolean(),
});
