import { Router } from 'express';
import { createSession, getUserSessions, getSessionById, endSession, getHint } from './session.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { generalLimiter, aiLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/', requireAuth, generalLimiter, createSession);
router.get('/', requireAuth, generalLimiter, getUserSessions);
router.get('/:id', requireAuth, generalLimiter, getSessionById);
router.patch('/:id/end', requireAuth, generalLimiter, endSession);
router.get('/:id/hint', requireAuth, aiLimiter, getHint);

export default router;
