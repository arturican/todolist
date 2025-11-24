import type { FilterValue } from '@/features/todolists/model/todolists-slice.ts';
import type { RequestStatus } from '@/common/types/types.ts';

export type Todolist = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export type DomainTodolist = Todolist & {
  filter: FilterValue;
  entityStatus: RequestStatus;
};
