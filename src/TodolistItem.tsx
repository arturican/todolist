import { Button } from './Button';
import type { FilterValue, Todolist } from './App';
import { CreateItemForm } from './CreateItemForm.tsx';

type Props = {
  todolist: Todolist;
  tasks: Task[];
  date?: number;
  deleteTask: (todolistId: string, id: string) => void;
  changeFilter: (todolistId: string, filter: FilterValue) => void;
  createTask: (todolistId: string, titleTask: string) => void;
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void;
  deleteTodolist: (todolistId: string) => void;
};
export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({
  todolist: { id, title, filter },
  tasks,
  date,
  deleteTask,
  changeFilter,
  createTask,
  changeTaskStatus,
  deleteTodolist,
}: Props) => {
  const deleteTaskHandler = (todolistId: string, task: string) => {
    deleteTask(todolistId, task);
  };
  const changeTaskStatusHandler = (todolistId: string, taskId: string, isDone: boolean) => {
    changeTaskStatus(todolistId, taskId, isDone);
  };
  const changeFilterHandler = (filter: FilterValue) => {
    changeFilter(id, filter);
  };
  const deleteTodolistHandler = () => {
    deleteTodolist(id);
  };
  const createTaskHandler = (title: string) => {
    createTask(id, title);
  };
  return (
    <div>
      <div className={'container'}>
        <h3>{title}</h3>
        <Button title={'x'} onClick={deleteTodolistHandler} />
      </div>
      <CreateItemForm onCreateItem={createTaskHandler} />
      <ul>
        {tasks.length === 0 ? (
          <span>{'Список задач пуст'}</span>
        ) : (
          tasks.map((task: Task) => {
            return (
              <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                <input
                  type={'checkbox'}
                  checked={task.isDone}
                  onChange={() => changeTaskStatusHandler(id, task.id, !task.isDone)}
                />
                <span>{task.title}</span>
                <Button title={'X'} onClick={() => deleteTaskHandler(id, task.id)} />
              </li>
            );
          })
        )}
      </ul>
      <div>
        <Button
          title={'All'}
          onClick={() => changeFilterHandler('all')}
          className={filter === 'all' ? 'active-filter' : ''}
        />
        <Button
          title={'Active'}
          onClick={() => changeFilterHandler('active')}
          className={filter === 'active' ? 'active-filter' : ''}
        />
        <Button
          title={'Completed'}
          onClick={() => changeFilterHandler('completed')}
          className={filter === 'completed' ? 'active-filter' : ''}
        />
      </div>
      <p>{date}</p>
    </div>
  );
};
