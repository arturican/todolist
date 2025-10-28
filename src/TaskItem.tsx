import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC } from '@/model/tasks-reducer.ts';
import ListItem from '@mui/material/ListItem';
import { getListItemSx } from '@/styles/TodolistItem.styles.ts';
import type { Task } from '@/Tasks.tsx';
import { Checkbox } from '@mui/material';
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan.tsx';
import IconButton from 'node_modules/@mui/material/IconButton/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ChangeEvent } from 'react';

type Props = {
  task: Task;
  todolistId: string;
};

export const TasksItem = ({ task, todolistId }: Props) => {
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
