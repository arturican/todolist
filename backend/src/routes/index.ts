import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { todolistsRoutes } from '../modules/todolists/todolists.routes.js';
import { tasksRoutes } from '../modules/tasks/tasks.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/todo-lists', todolistsRoutes);
apiRouter.use('/todo-lists', tasksRoutes);
