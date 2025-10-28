import { CreateItemForm } from '../CreateItemForm/CreateItemForm.tsx';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTaskAC } from '@/model/tasks-reducer.ts';
import { TodolistTitle } from '@/TodolistTitle.tsx';
import { Tasks } from '@/Tasks.tsx';
import type { Todolist } from '@/model/todolists-reducer.ts';
import { FilterButtons } from '@/FilterButtons.tsx';

type Props = {
  todolist: Todolist;
};

export const TodolistItem = ({ todolist }: Props) => {
  const { id } = todolist;
  const dispatch = useAppDispatch();
  const createTask = (title: string) => {
    dispatch(createTaskAC({ id, title }));
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
