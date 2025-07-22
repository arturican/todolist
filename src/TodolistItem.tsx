import { Button } from './Button.tsx';
import type { FilterValue } from './App.tsx';

type Props = {
  title: string;
  tasks: Task[];
  date?: number;
  deleteTask: (id: number) => void;
  changeFilter: (filter: FilterValue) => void;
};
export type Task = {
  id: number;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({ title, tasks, date, deleteTask, changeFilter }: Props) => {
  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {tasks.length === 0 ? (
          <span>{'Список задач пуст'}</span>
        ) : (
          tasks.map((task: Task) => {
            return (
              <li key={task.id}>
                <input type={'checkbox'} checked={task.isDone} />
                <span>{task.title}</span>
                <Button
                  title={'X'}
                  onClick={() => {
                    deleteTask(task.id);
                  }}
                />
              </li>
            );
          })
        )}
      </ul>
      <div>
        <Button title={'All'} onClick={() => changeFilter('all')} />
        <Button title={'Active'} onClick={() => changeFilter('active')} />
        <Button title={'Completed'} onClick={() => changeFilter('completed')} />
      </div>
      <p>{date}</p>
    </div>
  );
};
