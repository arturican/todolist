import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
  createTodolist,
  deleteTodolist,
  getTodolists,
  updateTodolistTitle,
} from './todolists.controller.js';

export const todolistsRoutes = Router();

todolistsRoutes.use(requireAuth);
todolistsRoutes.get('/', asyncHandler(getTodolists));
todolistsRoutes.post('/', asyncHandler(createTodolist));
todolistsRoutes.delete('/:id', asyncHandler(deleteTodolist));
todolistsRoutes.put('/:id', asyncHandler(updateTodolistTitle));
