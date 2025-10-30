import { instance } from '@/common/instance/instance.ts';
import type { DomainTask, GetTasksResponse } from '@/features/todolists/api/tasksApi.types.ts';
import type { BaseResponse } from '@/common/types/types.ts';

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, {
      title,
    });
  },
};
