import { Router } from 'express';
import { login, logout, me } from './auth.controller.js';
import { asyncHandler } from '../../middleware/async-handler.js';
import { loginRateLimiter } from './auth.rate-limit.js';

export const authRoutes = Router();

authRoutes.post('/login', loginRateLimiter, asyncHandler(login));
authRoutes.delete('/login', asyncHandler(logout));
authRoutes.get('/me', asyncHandler(me));
