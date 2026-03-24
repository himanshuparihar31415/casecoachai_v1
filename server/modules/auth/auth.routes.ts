import { Router } from 'express';
import { signup, login, logout, getMe } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
