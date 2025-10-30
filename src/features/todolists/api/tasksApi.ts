import { instance } from '@/common/instance/instance.ts';
import type { GetTasksResponse } from '@/features/todolists/api/tasksApi.types.ts';

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post(`/todo-lists/${todolistId}/tasks`, { title });
  },
};
