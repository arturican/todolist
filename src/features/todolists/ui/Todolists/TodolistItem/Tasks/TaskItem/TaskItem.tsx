import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  deleteTaskAC,
} from '@/features/todolists/model/tasks-reducer.ts';
import ListItem from '@mui/material/ListItem';
import { Checkbox } from '@mui/material';
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import type { TaskType } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles.ts';

type Props = {
  task: TaskType;
  todolistId: string;
};

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch();
  const deleteTask = () => {
    dispatch(deleteTaskAC({ todolistId, taskId: task.id }));
  };
  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked;
    dispatch(changeTaskStatusAC({ todolistId, taskId: task.id, isDone: newStatusValue }));
  };
  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }));
  };

  return (
    <ListItem sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};
