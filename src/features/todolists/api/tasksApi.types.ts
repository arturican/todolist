import { z } from 'zod/v4';
import { TaskPriority, TaskStatus } from '@/common/enums/enums.ts';
import type { RequestStatus } from '@/common/types/types.ts';
/*
export type DomainTask = {
  description: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
*/

export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: DomainTask[];
};

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({ local: true }),
});

export type DomainTask = z.infer<typeof domainTaskSchema> & {
  entityStatus?: RequestStatus;
};

export type UpdateTaskModel = {
  description: string | null;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  deadline: string | null;
};
