import type { RequestStatus } from '@/common/types/types.ts';
import { z } from 'zod/v4';
export type FilterValue = 'all' | 'active' | 'completed';
export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.number().int(),
});
export type Todolist = z.infer<typeof todolistSchema>;
export type DomainTodolist = Todolist & {
  filter: FilterValue;
  entityStatus: RequestStatus;
};
