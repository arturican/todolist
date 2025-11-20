import { CreateItemForm } from '@/common/components';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTaskTC } from '@/features/todolists/model/tasks-slice.ts';
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.tsx';
import { Tasks } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.tsx';
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons.tsx';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';

type Props = {
  todolist: DomainTodolist;
};

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();
  const createTask = (title: string) => {
    dispatch(createTaskTC({ todolistId: todolist.id, title }));
  };
  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  );
};
