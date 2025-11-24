import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import {
  deleteTaskTC,
  updateTaskTC,
} from '@/features/todolists/model/tasks-slice.ts';
import ListItem from '@mui/material/ListItem';
import { Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles.ts';
import { EditableSpan } from '@/common/components';
import type { DomainTask } from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';

type Props = {
  task: DomainTask;
  todolistId: string;
};

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch();
  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }));
  };
  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.target.checked;
    dispatch(
      updateTaskTC({
        todolistId,
        taskId: task.id,
        domainModel: {
          status: newStatusValue ? TaskStatus.Completed : TaskStatus.New,
        },
      }),
    );
  };
  const changeTaskTitle = (title: string) => {
    dispatch(
      updateTaskTC({ todolistId, taskId: task.id, domainModel: { title } }),
    );
  };
  const isTaskCompleted = task.status === TaskStatus.Completed;

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};
