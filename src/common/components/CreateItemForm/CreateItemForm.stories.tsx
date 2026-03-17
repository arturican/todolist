import type { Meta, StoryObj } from '@storybook/react';
import { CreateItemForm } from './CreateItemForm.tsx';

const meta: Meta<typeof CreateItemForm> = {
  title: 'Forms/CreateItemForm',
  component: CreateItemForm,
  argTypes: {
    onCreateItem: { action: 'create-item' },
  },
  args: {
    disabled: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
