import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from './tasks.controller.js';

export const tasksRoutes = Router();

tasksRoutes.use(requireAuth);
tasksRoutes.get('/:todolistId/tasks', asyncHandler(getTasks));
tasksRoutes.post('/:todolistId/tasks', asyncHandler(createTask));
tasksRoutes.put('/:todolistId/tasks/:taskId', asyncHandler(updateTask));
tasksRoutes.delete('/:todolistId/tasks/:taskId', asyncHandler(deleteTask));
