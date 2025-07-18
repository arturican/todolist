import { Button } from './Button.tsx';

type Props = {
  title: string;
  tasks: Task[];
  date?: any;
};
export type Task = {
  id: number;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({ title, tasks, date }: Props) => {
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
              </li>
            );
          })
        )}
      </ul>
      <div>
        <Button title={'All'} />
        <Button title={'Active'} />
        <Button title={'Completed'} />
      </div>
      <p>{date}</p>
    </div>
  );
};
