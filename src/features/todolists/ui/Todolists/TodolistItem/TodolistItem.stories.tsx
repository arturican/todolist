import type { Meta, StoryObj } from '@storybook/react';
import List from '@mui/material/List';
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.tsx';
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm.tsx';
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx';
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons.tsx';
import taskListStyles from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.module.css';
import gridStyles from '@/features/todolists/ui/Todolists/Todolists.module.css';
import { storyTasks, storyTodolist } from '@/storybook/storyStore.ts';

const TodolistCardPreview = () => (
  <article className={gridStyles.card} style={{ maxWidth: '30rem' }}>
    <TodolistTitle todolist={storyTodolist} />
    <CreateItemForm onCreateItem={() => undefined} />
    <List className={taskListStyles.list}>
      {storyTasks.map(task => (
        <TaskItem key={task.id} task={task} todolist={storyTodolist} />
      ))}
    </List>
    <FilterButtons todolist={storyTodolist} />
  </article>
);

const meta: Meta<typeof TodolistCardPreview> = {
  title: 'Todolists/TodolistCard',
  component: TodolistCardPreview,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
