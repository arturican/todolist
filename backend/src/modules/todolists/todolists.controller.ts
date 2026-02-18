import { type Request, type Response } from 'express';
import {
  createEmptySuccessResponse,
  createErrorResponse,
  createSuccessResponse,
} from '../../lib/response.js';
import { zodIssuesToFieldErrors } from '../../lib/validation.js';
import { todolistTitleSchema } from './todolists.schemas.js';
import {
  createUserTodolist,
  deleteUserTodolist,
  findUserTodolists,
  toApiTodolist,
  updateUserTodolistTitle,
} from './todolists.service.js';

const getAuthorizedUserId = (req: Request): number => req.userId as number;

export const getTodolists = async (req: Request, res: Response) => {
  const userId = getAuthorizedUserId(req);
  const todolists = await findUserTodolists(userId);
  return res.status(200).json(todolists.map(toApiTodolist));
};

export const createTodolist = async (req: Request, res: Response) => {
  const parsedBody = todolistTitleSchema.safeParse(req.body);
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
  const createdTodolist = await createUserTodolist(
    userId,
    parsedBody.data.title,
  );

  return res.status(200).json(
    createSuccessResponse({
      item: toApiTodolist(createdTodolist),
    }),
  );
};

export const deleteTodolist = async (req: Request, res: Response) => {
  const userId = getAuthorizedUserId(req);
  const isDeleted = await deleteUserTodolist(userId, req.params.id);
  if (!isDeleted) {
    return res.status(200).json(createErrorResponse('Todolist not found'));
  }

  return res.status(200).json(createEmptySuccessResponse());
};

export const updateTodolistTitle = async (req: Request, res: Response) => {
  const parsedBody = todolistTitleSchema.safeParse(req.body);
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
  const updatedTodolist = await updateUserTodolistTitle(
    userId,
    req.params.id,
    parsedBody.data.title,
  );

  if (!updatedTodolist) {
    return res.status(200).json(createErrorResponse('Todolist not found'));
  }

  return res.status(200).json(createEmptySuccessResponse());
};
