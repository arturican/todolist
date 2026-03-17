import type { Meta, StoryObj } from '@storybook/react';
import List from '@mui/material/List';
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx';
import styles from './Tasks.module.css';
import { storyTasks, storyTodolist } from '@/storybook/storyStore.ts';

type TaskListPreviewProps = {
  empty?: boolean;
};

const TaskListPreview = ({ empty = false }: TaskListPreviewProps) => {
  if (empty) {
    return <span className={styles.empty}>Task list is empty</span>;
  }

  return (
    <List className={styles.list}>
      {storyTasks.map(task => (
        <TaskItem key={task.id} task={task} todolist={storyTodolist} />
      ))}
    </List>
  );
};

const meta: Meta<typeof TaskListPreview> = {
  title: 'Todolists/TaskList',
  component: TaskListPreview,
  parameters: {
    layout: 'centered',
  },
  args: {
    empty: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
  args: {
    empty: true,
  },
};
