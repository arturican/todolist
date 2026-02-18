import { prisma } from '../../db/prisma.js';
import { toApiDate } from '../../lib/date.js';

type TodolistRecord = {
  id: string;
  title: string;
  addedDate: Date;
  order: number;
};

export const toApiTodolist = (todolist: TodolistRecord) => ({
  id: todolist.id,
  title: todolist.title,
  addedDate: toApiDate(todolist.addedDate) as string,
  order: todolist.order,
});

export const findUserTodolists = async (userId: number) => {
  return prisma.todolist.findMany({
    where: { userId },
    orderBy: [{ order: 'asc' }, { addedDate: 'desc' }],
  });
};

export const createUserTodolist = async (userId: number, title: string) => {
  const order = await prisma.todolist.count({ where: { userId } });
  return prisma.todolist.create({
    data: {
      userId,
      title: title.trim(),
      order,
    },
  });
};

export const updateUserTodolistTitle = async (
  userId: number,
  id: string,
  title: string,
) => {
  const existing = await prisma.todolist.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  return prisma.todolist.update({
    where: { id: existing.id },
    data: { title: title.trim() },
  });
};

export const deleteUserTodolist = async (userId: number, id: string) => {
  const existing = await prisma.todolist.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  await prisma.todolist.delete({
    where: { id: existing.id },
  });

  return true;
};

export const findOwnedTodolist = async (userId: number, todolistId: string) => {
  return prisma.todolist.findFirst({
    where: { id: todolistId, userId },
  });
};
