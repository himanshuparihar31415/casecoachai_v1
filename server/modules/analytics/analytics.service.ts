import mongoose from 'mongoose';
import { Report } from '../../models/Report.js';
import { Session } from '../../models/Session.js';
import { Case } from '../../models/Case.js';

export async function getOverview(userId: string) {
  const reports = await Report.find({ userId });

  if (reports.length === 0) {
    return {
      totalSessions: 0,
      avgOverallScore: 0,
      competencies: {
        structure: 0,
        math: 0,
        businessJudgment: 0,
        communication: 0,
        creativity: 0,
        hypothesis: 0,
      },
    };
  }

  const avg = (key: keyof typeof reports[0]['competencies']) =>
    Math.round(reports.reduce((sum, r) => sum + (r.competencies[key]?.score ?? 0), 0) / reports.length);

  return {
    totalSessions: reports.length,
    avgOverallScore: Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length),
    competencies: {
      structure: avg('structure'),
      math: avg('math'),
      businessJudgment: avg('businessJudgment'),
      communication: avg('communication'),
      creativity: avg('creativity'),
      hypothesis: avg('hypothesis'),
    },
  };
}

export async function getTrends(userId: string, limit = 10) {
  const reports = await Report.find({ userId })
    .sort({ generatedAt: -1 })
    .limit(limit)
    .select('overallScore competencies generatedAt sessionId');

  return reports.reverse().map((r, i) => ({
    session: i + 1,
    overallScore: r.overallScore,
    structure: r.competencies.structure?.score ?? 0,
    math: r.competencies.math?.score ?? 0,
    businessJudgment: r.competencies.businessJudgment?.score ?? 0,
    communication: r.competencies.communication?.score ?? 0,
    date: r.generatedAt,
  }));
}

export async function getWeaknesses(userId: string) {
  const reports = await Report.find({ userId });
  if (reports.length === 0) return [];

  type CompetencyKey = 'structure' | 'math' | 'businessJudgment' | 'communication' | 'creativity' | 'hypothesis';
  const keys: CompetencyKey[] = ['structure', 'math', 'businessJudgment', 'communication', 'creativity', 'hypothesis'];

  const scores = keys.map((key) => ({
    name: key,
    avg: Math.round(reports.reduce((sum, r) => sum + (r.competencies[key]?.score ?? 0), 0) / reports.length),
  }));

  return scores.sort((a, b) => a.avg - b.avg).slice(0, 3);
}

export async function getHistory(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const sessions = await Session.find({ userId, status: 'completed' })
    .populate('caseId', 'title type industry difficulty')
    .sort({ startedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Session.countDocuments({ userId, status: 'completed' });

  const sessionIds = sessions.map((s) => s._id);
  const reports = await Report.find({ sessionId: { $in: sessionIds } }).select('sessionId overallScore overallGrade');

  const reportMap = new Map(reports.map((r) => [r.sessionId.toString(), r]));

  const history = sessions.map((s) => {
    const caseDoc = s.caseId as unknown as InstanceType<typeof Case>;
    const report = reportMap.get(s._id.toString());
    return {
      sessionId: s._id,
      caseTitle: caseDoc?.title ?? 'Unknown Case',
      caseType: caseDoc?.type ?? s.config.caseType,
      industry: caseDoc?.industry ?? s.config.industry,
      status: s.status,
      score: report?.overallScore ?? null,
      grade: report?.overallGrade ?? null,
      durationSeconds: s.durationSeconds ?? null,
      date: s.startedAt,
    };
  });

  return { history, total, page, limit };
}
