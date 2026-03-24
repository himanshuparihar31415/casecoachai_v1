import mongoose, { Document, Schema } from 'mongoose';

export type CaseType = 'profitability' | 'market_entry' | 'ma' | 'growth' | 'pricing' | 'operations';
export type Industry = 'tech' | 'cpg' | 'pharma' | 'finance' | 'energy' | 'automotive' | 'retail';

export interface ICase extends Document {
  title: string;
  type: CaseType;
  industry: Industry;
  difficulty: number;
  description: string;
  scenario: string;
  keyDataPoints: Array<{ label: string; value: string }>;
  questions: string[];
  isSeeded: boolean;
  generatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['profitability', 'market_entry', 'ma', 'growth', 'pricing', 'operations'],
    },
    industry: {
      type: String,
      required: true,
      enum: ['tech', 'cpg', 'pharma', 'finance', 'energy', 'automotive', 'retail'],
    },
    difficulty: { type: Number, required: true, min: 1, max: 4 },
    description: { type: String, required: true },
    scenario: { type: String, required: true },
    keyDataPoints: [{ label: String, value: String }],
    questions: [String],
    isSeeded: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CaseSchema.index({ type: 1, industry: 1, difficulty: 1 });

export const Case = mongoose.model<ICase>('Case', CaseSchema);
