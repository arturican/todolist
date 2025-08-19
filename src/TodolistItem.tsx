import { Button } from './Button.tsx';
import type { FilterValue } from './App.tsx';
import { KeyboardEvent, ChangeEvent, useState } from 'react';

type Props = {
  title: string;
  tasks: Task[];
  date?: number;
  deleteTask: (id: string) => void;
  changeFilter: (filter: FilterValue) => void;
  createTask: (titleTask: string) => void;
  changeTaskStatus: (taskId: string, isDone: boolean) => void;
};
export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({
  title,
  tasks,
  date,
  deleteTask,
  changeFilter,
  createTask,
  changeTaskStatus,
}: Props) => {
  const [titleTask, setTitleTask] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const createTaskHandler = () => {
    const trimmedTitle = titleTask.trim();
    if (titleTask.trim() !== '') {
      createTask(trimmedTitle);
      setTitleTask('');
    } else {
      setError('Title is required');
    }
  };
  const changeTaskTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleTask(event.currentTarget.value);
    setError(null);
  };
  const createTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createTaskHandler();
    }
  };
  const deleteTaskHandler = (task: string) => {
    deleteTask(task);
  };
  const changeTaskStatusHandler = (taskId: string, isDone: boolean) => {
    changeTaskStatus(taskId, isDone);
  };
  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input
          className={error ? 'error' : ''}
          value={titleTask}
          onChange={changeTaskTitleHandler}
          onKeyDown={createTaskOnEnterHandler}
        />
        <Button title={'+'} onClick={createTaskHandler} />
        <div className={'error-message'}>{error}</div>
      </div>
      <ul>
        {tasks.length === 0 ? (
          <span>{'Список задач пуст'}</span>
        ) : (
          tasks.map((task: Task) => {
            return (
              <li key={task.id}>
                <input
                  type={'checkbox'}
                  checked={task.isDone}
                  onChange={() => changeTaskStatusHandler(task.id, !task.isDone)}
                />
                <span>{task.title}</span>
                <Button title={'X'} onClick={() => deleteTaskHandler(task.id)} />
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
