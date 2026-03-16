import { z } from 'zod';

const nullableIsoDateSchema = z.union([
  z.iso.datetime({ local: true }),
  z.null(),
]);

export const taskTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be at most 100 characters' }),
});

export const taskListParamsSchema = z.object({
  todolistId: z.string().cuid(),
});

export const taskParamsSchema = z.object({
  todolistId: z.string().cuid(),
  taskId: z.string().cuid(),
});

export const updateTaskSchema = z.object({
  description: z.string().max(500).nullable(),
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  status: z.number().int().min(0).max(3),
  priority: z.number().int().min(0).max(4),
  startDate: nullableIsoDateSchema,
  deadline: nullableIsoDateSchema,
});

export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
