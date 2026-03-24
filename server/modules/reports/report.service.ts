import { Report, IReport } from '../../models/Report.js';
import { Session } from '../../models/Session.js';
import { Case } from '../../models/Case.js';
import { AppError } from '../../middleware/errorHandler.js';
import { generateScoringWithAI } from '../../ai/client.js';

export async function getOrGenerateReport(sessionId: string, userId: string): Promise<IReport> {
  // Return cached report if it exists
  const existing = await Report.findOne({ sessionId, userId });
  if (existing) return existing;

  return generateReport(sessionId, userId);
}

export async function generateReport(sessionId: string, userId: string): Promise<IReport> {
  const session = await Session.findOne({ _id: sessionId, userId }).populate('caseId');
  if (!session) throw new AppError(404, 'Session not found');
  if (session.status !== 'completed') throw new AppError(400, 'Session must be completed before generating a report');
  if (session.transcript.length === 0) throw new AppError(400, 'No transcript available for scoring');

  const caseDoc = session.caseId as unknown as InstanceType<typeof Case>;

  const transcriptText = session.transcript
    .map((t) => `${t.role.toUpperCase()}: ${t.text}`)
    .join('\n');

  const scoring = await generateScoringWithAI(transcriptText, caseDoc.title, caseDoc.type);

  // Delete existing report if regenerating
  await Report.deleteOne({ sessionId, userId });

  const report = await Report.create({
    sessionId,
    userId,
    ...scoring,
    generatedAt: new Date(),
  });

  return report;
}
