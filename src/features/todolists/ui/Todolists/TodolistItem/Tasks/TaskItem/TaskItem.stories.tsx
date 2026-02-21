import type { Meta, StoryObj } from '@storybook/react';
import List from '@mui/material/List';
import { TaskItem } from './TaskItem.tsx';
import { storyTasks, storyTodolist } from '@/storybook/storyStore.ts';

const meta: Meta<typeof TaskItem> = {
  title: 'Todolists/TaskItem',
  component: TaskItem,
  args: {
    task: storyTasks[0],
    todolist: storyTodolist,
  },
  decorators: [
    Story => (
      <div style={{ width: 'min(100%, 38rem)' }}>
        <List disablePadding>
          <Story />
        </List>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveTask: Story = {};

export const CompletedTask: Story = {
  args: {
    task: storyTasks[1],
  },
};
