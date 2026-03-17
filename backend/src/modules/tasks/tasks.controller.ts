import { type Request, type Response } from 'express';
import {
  createEmptySuccessResponse,
  createErrorResponse,
  createSuccessResponse,
} from '../../lib/response.js';
import { zodIssuesToFieldErrors } from '../../lib/validation.js';
import { findOwnedTodolist } from '../todolists/todolists.service.js';
import {
  createTaskForTodolist,
  deleteTaskInTodolist,
  findTaskInTodolist,
  findTasksByTodolist,
  toApiTask,
  updateTaskInTodolist,
} from './tasks.service.js';
import {
  taskListParamsSchema,
  taskParamsSchema,
  taskTitleSchema,
  updateTaskSchema,
} from './tasks.schemas.js';

const getAuthorizedUserId = (req: Request): number => req.userId as number;

export const getTasks = async (req: Request, res: Response) => {
  const parsedParams = taskListParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedParams.error),
        ),
      );
  }

  const userId = getAuthorizedUserId(req);
  const { todolistId } = parsedParams.data;

  const todolist = await findOwnedTodolist(userId, todolistId);
  if (!todolist) {
    return res.status(200).json({
      error: 'Todolist not found',
      totalCount: 0,
      items: [],
    });
  }

  const tasks = await findTasksByTodolist(todolistId);
  return res.status(200).json({
    error: null,
    totalCount: tasks.length,
    items: tasks.map(toApiTask),
  });
};

export const createTask = async (req: Request, res: Response) => {
  const parsedParams = taskListParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedParams.error),
        ),
      );
  }

  const parsedBody = taskTitleSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedBody.error),
        ),
      );
  }

  const userId = getAuthorizedUserId(req);
  const { todolistId } = parsedParams.data;
  const todolist = await findOwnedTodolist(userId, todolistId);
  if (!todolist) {
    return res.status(200).json(createErrorResponse('Todolist not found'));
  }

  const task = await createTaskForTodolist(todolistId, parsedBody.data.title);
  return res.status(200).json(
    createSuccessResponse({
      item: toApiTask(task),
    }),
  );
};

export const updateTask = async (req: Request, res: Response) => {
  const parsedParams = taskParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedParams.error),
        ),
      );
  }

  const parsedBody = updateTaskSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedBody.error),
        ),
      );
  }

  const userId = getAuthorizedUserId(req);
  const { todolistId, taskId } = parsedParams.data;
  const todolist = await findOwnedTodolist(userId, todolistId);
  if (!todolist) {
    return res.status(200).json(createErrorResponse('Todolist not found'));
  }

  const task = await findTaskInTodolist(todolistId, taskId);
  if (!task) {
    return res.status(200).json(createErrorResponse('Task not found'));
  }

  const updatedTask = await updateTaskInTodolist(task.id, parsedBody.data);
  return res.status(200).json(
    createSuccessResponse({
      item: toApiTask(updatedTask),
    }),
  );
};

export const deleteTask = async (req: Request, res: Response) => {
  const parsedParams = taskParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res
      .status(200)
      .json(
        createErrorResponse(
          'Incorrect data',
          zodIssuesToFieldErrors(parsedParams.error),
        ),
      );
  }

  const userId = getAuthorizedUserId(req);
  const { todolistId, taskId } = parsedParams.data;

  const todolist = await findOwnedTodolist(userId, todolistId);
  if (!todolist) {
    return res.status(200).json(createErrorResponse('Todolist not found'));
  }

  const task = await findTaskInTodolist(todolistId, taskId);
  if (!task) {
    return res.status(200).json(createErrorResponse('Task not found'));
  }

  await deleteTaskInTodolist(task.id);
  return res.status(200).json(createEmptySuccessResponse());
};
