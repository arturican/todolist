import { z } from 'zod';

export const todolistTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be at most 100 characters' }),
});

export const todolistIdParamsSchema = z.object({
  id: z.string().cuid(),
});

export type TodolistTitleBody = z.infer<typeof todolistTitleSchema>;
