import { CreateItemForm } from './CreateItemForm/CreateItemForm.tsx';
import { EditableSpan } from './EditableSpan/EditableSpan.tsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box } from '@mui/material';
import { containerSX, getListItemSx } from '@/styles/TodolistItem.styles.ts';
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  deleteTodolistAC,
  type FilterValue,
  type Todolist,
} from '@/model/todolists-reducer.ts';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTasks } from '@/model/tasks-selectors.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskAC,
  deleteTaskAC,
} from '@/model/tasks-reducer.ts';

type Props = {
  todolist: Todolist;
};
export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({ todolist: { id, title, filter } }: Props) => {
  const todolistId = id;
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();
  const deleteTask = (todolistId: string, taskId: string) => {
    dispatch(deleteTaskAC({ todolistId, taskId }));
  };
  const createTask = (title: string) => {
    dispatch(createTaskAC({ todolistId, title }));
  };

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC({ todolistId, taskId, isDone }));
  };

  const changeFilter = (filter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ todolistId, filter }));
  };

  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId, title }));
  };

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({ todolistId: todolistId }));
  };

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleAC({ todolistId, title }));
  };

  const todolistTasks = tasks[id];
  let filteredTask = todolistTasks;
  if (filter === 'active') {
    filteredTask = todolistTasks.filter((tasks: { isDone: boolean }) => !tasks.isDone);
  }
  if (filter === 'completed') {
    filteredTask = todolistTasks.filter((tasks: { isDone: boolean }) => tasks.isDone);
  }

  return (
    <div>
      <div className={'container'}>
        <h3>
          <EditableSpan value={title} onChange={changeTodolistTitle} />
        </h3>
        <IconButton onClick={deleteTodolist}>
          <DeleteIcon />
        </IconButton>
      </div>
      <CreateItemForm onCreateItem={createTask} />
      <List>
        {filteredTask.length === 0 ? (
          <span>{'Список задач пуст'}</span>
        ) : (
          filteredTask.map((task: Task) => {
            const changeTaskTitleHandler = (title: string) => {
              changeTaskTitle(id, task.id, title);
            };
            return (
              <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
                <div>
                  <Checkbox
                    checked={task.isDone}
                    onChange={() => changeTaskStatus(id, task.id, !task.isDone)}
                  />
                  <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
                </div>
                <IconButton onClick={() => deleteTask(id, task.id)}>
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
          onClick={() => changeFilter('all')}
        >
          ALL
        </Button>
        <Button
          variant={filter === 'active' ? 'outlined' : 'text'}
          color={'primary'}
          onClick={() => changeFilter('active')}
        >
          ACTIVE
        </Button>
        <Button
          variant={filter === 'completed' ? 'outlined' : 'text'}
          color={'secondary'}
          onClick={() => changeFilter('completed')}
        >
          COMPLETED
        </Button>
      </Box>
    </div>
  );
};
