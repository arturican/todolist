import { z } from 'zod';

export const taskTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be at most 100 characters' }),
});

export const updateTaskSchema = z.object({
  description: z.string().nullable(),
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  status: z.number().int().min(0),
  priority: z.number().int().min(0),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
});

export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
