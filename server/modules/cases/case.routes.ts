import { Router } from 'express';
import { listCases, getCaseById, generateCase, seedCases, listMyCases, createCustomCase } from './case.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { aiLimiter, generalLimiter } from '../../middleware/rateLimiter.js';
import { pdfUpload } from '../../middleware/upload.js';

const router = Router();

router.get('/', requireAuth, generalLimiter, listCases);
router.get('/mine', requireAuth, generalLimiter, listMyCases);
router.get('/:id', requireAuth, generalLimiter, getCaseById);
router.post('/generate', requireAuth, aiLimiter, generateCase);
router.post('/seed', requireAuth, seedCases);
router.post('/custom', requireAuth, generalLimiter, pdfUpload.single('file'), createCustomCase);

export default router;
