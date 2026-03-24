import mongoose, { Document, Schema } from 'mongoose';

export type OverallGrade = 'STRONG_PASS' | 'PASS' | 'BORDERLINE' | 'FAIL';

export interface CompetencyScore {
  score: number;
  flag?: string;
}

export interface IReport extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  overallScore: number;
  overallGrade: OverallGrade;
  competencies: {
    structure: CompetencyScore;
    math: CompetencyScore;
    businessJudgment: CompetencyScore;
    communication: CompetencyScore;
    creativity: CompetencyScore;
    hypothesis: CompetencyScore;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    momentsOfExcellence: string[];
    missedOpportunities: string[];
    keyHypotheses: string[];
  };
  executiveSummary: string;
  generatedAt: Date;
}

const CompetencySchema = new Schema({ score: Number, flag: String }, { _id: false });

const ReportSchema = new Schema<IReport>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    overallScore: { type: Number, required: true },
    overallGrade: {
      type: String,
      enum: ['STRONG_PASS', 'PASS', 'BORDERLINE', 'FAIL'],
      required: true,
    },
    competencies: {
      structure: CompetencySchema,
      math: CompetencySchema,
      businessJudgment: CompetencySchema,
      communication: CompetencySchema,
      creativity: CompetencySchema,
      hypothesis: CompetencySchema,
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      momentsOfExcellence: [String],
      missedOpportunities: [String],
      keyHypotheses: [String],
    },
    executiveSummary: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
