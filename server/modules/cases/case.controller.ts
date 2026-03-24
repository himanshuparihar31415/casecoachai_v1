import { Response, NextFunction } from 'express';
import * as caseService from './case.service.js';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { CaseType, Industry } from '../../models/Case.js';

export async function listCases(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, industry, difficulty, tab, page, limit } = req.query as Record<string, string>;
    const result = await caseService.listCases({
      type: type as CaseType,
      industry: industry as Industry,
      difficulty: difficulty ? Number(difficulty) : undefined,
      tab,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCaseById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const c = await caseService.getCaseById(req.params.id);
    res.json({ case: c });
  } catch (err) {
    next(err);
  }
}

export async function generateCase(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, industry, difficulty } = req.body;
    if (!type || !industry || !difficulty) {
      throw new AppError(400, 'type, industry, and difficulty are required');
    }
    const c = await caseService.generateCase(type as CaseType, industry as Industry, Number(difficulty));
    res.status(201).json({ case: c });
  } catch (err) {
    next(err);
  }
}

export async function seedCases(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await caseService.seedCases();
    res.json({ message: `Seeded ${count} cases` });
  } catch (err) {
    next(err);
  }
}
