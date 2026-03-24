import { Router } from 'express';
import { listCases, getCaseById, generateCase, seedCases } from './case.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { aiLimiter, generalLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.get('/', requireAuth, generalLimiter, listCases);
router.get('/:id', requireAuth, generalLimiter, getCaseById);
router.post('/generate', requireAuth, aiLimiter, generateCase);
router.post('/seed', requireAuth, seedCases);

export default router;
