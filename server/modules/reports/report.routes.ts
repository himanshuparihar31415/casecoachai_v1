import { Router } from 'express';
import { getReport, regenerateReport } from './report.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { aiLimiter, generalLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.get('/:sessionId', requireAuth, generalLimiter, getReport);
router.post('/:sessionId/regenerate', requireAuth, aiLimiter, regenerateReport);

export default router;
