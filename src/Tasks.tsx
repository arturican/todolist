import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { getListItemSx } from '@/styles/TodolistItem.styles.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC } from '@/model/tasks-reducer.ts';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTasks } from '@/model/tasks-selectors.ts';
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan.tsx';
import type { Todolist } from '@/model/todolists-reducer.ts';

export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};
type Props = {
  todolist: Todolist;
};

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();
  const deleteTask = (id: string, taskId: string) => {
    dispatch(deleteTaskAC({ id, taskId }));
  };
  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC({ todolistId, taskId, isDone }));
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
  );
};
