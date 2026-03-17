import { instance } from '@/common/instance/instance.ts';
import type {
  DomainTodolist,
  Todolist,
} from '@/features/todolists/api/todolistsApi.types.ts';
import type { BaseResponse } from '@/common/types/types.ts';

export const todolistsApi = {
  getTodolists() {
    return instance.get<DomainTodolist[]>(`/todo-lists`);
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>(`/todo-lists`, {
      title,
    });
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`);
  },
  changeTodolistTitle({ id, title }: { id: string; title: string }) {
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title });
  },
};
