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
import { EditableSpan } from '@/common/components';
import type { DomainTask } from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import styles from './TaskItem.module.css';

type Props = {
  task: DomainTask;
  todolist: DomainTodolist;
};

export const TaskItem = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch();
  const disabled = todolist.entityStatus === 'loading';

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId: todolist.id, taskId: task.id }));
  };

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.target.checked;
    dispatch(
      updateTaskTC({
        todolistId: todolist.id,
        taskId: task.id,
        domainModel: {
          status: newStatusValue ? TaskStatus.Completed : TaskStatus.New,
        },
      }),
    );
  };

  const changeTaskTitle = (title: string) => {
    dispatch(
      updateTaskTC({
        todolistId: todolist.id,
        taskId: task.id,
        domainModel: { title },
      }),
    );
  };

  const isTaskCompleted = task.status === TaskStatus.Completed;

  return (
    <ListItem className={styles.row}>
      <div className={styles.left}>
        <Checkbox
          className={styles.checkbox}
          checked={isTaskCompleted}
          onChange={changeTaskStatus}
          disabled={disabled}
        />
        <div
          className={`${styles.title} ${isTaskCompleted ? styles.completed : ''}`}
        >
          <EditableSpan
            value={task.title}
            onChange={changeTaskTitle}
            entityStatus={todolist.entityStatus}
          />
        </div>
      </div>
      <span className={styles.date}>
        {new Date(task.addedDate).toLocaleDateString()}
      </span>
      <IconButton
        className={styles.deleteButton}
        onClick={deleteTask}
        disabled={disabled}
        aria-label="Delete task"
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};
