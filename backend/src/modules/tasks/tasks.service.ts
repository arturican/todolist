import { prisma } from '../../db/prisma.js';
import { fromApiDate, toApiDate } from '../../lib/date.js';
import { type UpdateTaskBody } from './tasks.schemas.js';

type TaskRecord = {
  description: string | null;
  title: string;
  status: number;
  priority: number;
  startDate: Date | null;
  deadline: Date | null;
  id: string;
  todoListId: string;
  order: number;
  addedDate: Date;
};

export const toApiTask = (task: TaskRecord) => ({
  description: task.description,
  title: task.title,
  status: task.status,
  priority: task.priority,
  startDate: toApiDate(task.startDate),
  deadline: toApiDate(task.deadline),
  id: task.id,
  todoListId: task.todoListId,
  order: task.order,
  addedDate: toApiDate(task.addedDate) as string,
});

export const findTasksByTodolist = async (todolistId: string) => {
  return prisma.task.findMany({
    where: { todoListId: todolistId },
    orderBy: [{ order: 'asc' }, { addedDate: 'desc' }],
  });
};

export const createTaskForTodolist = async (
  todolistId: string,
  title: string,
) => {
  const order = await prisma.task.count({ where: { todoListId: todolistId } });
  return prisma.task.create({
    data: {
      title: title.trim(),
      description: null,
      status: 0,
      priority: 0,
      startDate: null,
      deadline: null,
      order,
      todoListId: todolistId,
    },
  });
};

export const findTaskInTodolist = async (
  todolistId: string,
  taskId: string,
) => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      todoListId: todolistId,
    },
  });
};

export const updateTaskInTodolist = async (
  taskId: string,
  model: UpdateTaskBody,
) => {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      description: model.description,
      title: model.title.trim(),
      status: model.status,
      priority: model.priority,
      startDate: fromApiDate(model.startDate),
      deadline: fromApiDate(model.deadline),
    },
  });
};

export const deleteTaskInTodolist = async (taskId: string) => {
  await prisma.task.delete({
    where: { id: taskId },
  });
};
