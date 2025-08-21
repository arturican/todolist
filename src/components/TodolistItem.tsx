import type { FilterValue, Todolist } from '../App.tsx';
import { CreateItemForm } from './CreateItemForm.tsx';
import { EditableSpan } from './EditableSpan.tsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box } from '@mui/material';
import { containerSX, getListItemSx } from '../styles/TodolistItem.styles.ts';

type Props = {
  todolist: Todolist;
  tasks: Task[];
  date?: number;
  deleteTask: (todolistId: string, id: string) => void;
  changeFilter: (todolistId: string, filter: FilterValue) => void;
  createTask: (todolistId: string, titleTask: string) => void;
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void;
  deleteTodolist: (todolistId: string) => void;
  changeTaskTitle: (todolistId: string, taskId: string, title: string) => void;
  changeTodolistTitle: (todolistId: string, title: string) => void;
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
  changeTaskTitle,
  changeTodolistTitle,
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

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle(id, title);
  };

  return (
    <div>
      <div className={'container'}>
        <h3>
          <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
        </h3>
        <IconButton onClick={deleteTodolistHandler}>
          <DeleteIcon />
        </IconButton>
      </div>
      <CreateItemForm onCreateItem={createTaskHandler} />
      <List>
        {tasks.length === 0 ? (
          <span>{'Список задач пуст'}</span>
        ) : (
          tasks.map((task: Task) => {
            const changeTaskTitleHandler = (title: string) => {
              changeTaskTitle(id, task.id, title);
            };
            return (
              <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
                <div>
                  <Checkbox
                    checked={task.isDone}
                    onChange={() => changeTaskStatusHandler(id, task.id, !task.isDone)}
                  />
                  <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
                </div>
                <IconButton onClick={() => deleteTaskHandler(id, task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })
        )}
      </List>
      <Box sx={containerSX}>
        <Button
          variant={filter === 'all' ? 'outlined' : 'text'}
          color={'inherit'}
          onClick={() => changeFilterHandler('all')}
        >
          ALL
        </Button>
        <Button
          variant={filter === 'active' ? 'outlined' : 'text'}
          color={'primary'}
          onClick={() => changeFilterHandler('active')}
        >
          ACTIVE
        </Button>
        <Button
          variant={filter === 'completed' ? 'outlined' : 'text'}
          color={'secondary'}
          onClick={() => changeFilterHandler('completed')}
        >
          COMPLETED
        </Button>
      </Box>
      <p>{date}</p>
    </div>
  );
};
