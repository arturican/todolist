import { Router } from 'express';
import { login, logout, me } from './auth.controller.js';
import { asyncHandler } from '../../middleware/async-handler.js';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(login));
authRoutes.delete('/login', asyncHandler(logout));
authRoutes.get('/me', asyncHandler(me));
