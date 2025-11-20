import type { FilterValue } from '@/features/todolists/model/todolists-slice.ts';

export type Todolist = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export type DomainTodolist = Todolist & {
  filter: FilterValue;
};
