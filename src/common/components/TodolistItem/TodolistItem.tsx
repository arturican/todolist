import { CreateItemForm } from '../CreateItemForm/CreateItemForm.tsx';
import { EditableSpan } from '../EditableSpan/EditableSpan.tsx';
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
import { TodolistTitle } from '@/TodolistTitle.tsx';

type Props = {
  todolist: Todolist;
};
export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};

export const TodolistItem = ({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks);
  const { id, filter } = todolist;
  const dispatch = useAppDispatch();
  const deleteTask = (id: string, taskId: string) => {
    dispatch(deleteTaskAC({ id, taskId }));
  };
  const createTask = (title: string) => {
    dispatch(createTaskAC({ id, title }));
  };

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC({ todolistId, taskId, isDone }));
  };

  const changeFilter = (filter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter }));
  };

  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId, title }));
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
      <TodolistTitle todolist={todolist} />
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
