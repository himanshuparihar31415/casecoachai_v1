import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Share2, ArrowRight, ExternalLink, BarChart2, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/src/lib/api';

interface Competency {
  score: number;
  flag?: string;
}

interface ReportData {
  overallScore: number;
  overallGrade: 'STRONG_PASS' | 'PASS' | 'BORDERLINE' | 'FAIL';
  competencies: {
    structure: Competency;
    math: Competency;
    businessJudgment: Competency;
    communication: Competency;
    creativity: Competency;
    hypothesis: Competency;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    momentsOfExcellence: string[];
    missedOpportunities: string[];
    keyHypotheses: string[];
  };
  executiveSummary: string;
}

const gradeLabel: Record<string, string> = {
  STRONG_PASS: 'STRONG PASS',
  PASS: 'PASS',
  BORDERLINE: 'BORDERLINE',
  FAIL: 'FAIL',
};

const circumference = 2 * Math.PI * 88; // r=88

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) return;
    api.get<{ report: ReportData }>(`/reports/${sessionId}`)
      .then((data) => {
        setReport(data.report);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load report.');
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-on-tertiary-container mx-auto" />
          <p className="text-secondary font-body">Generating your performance report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-secondary font-body">{error || 'Report not available.'}</p>
          <Link to="/dashboard" className="text-primary font-bold underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const competencyList = [
    { label: 'Structure', key: 'structure' as const },
    { label: 'Math Accuracy', key: 'math' as const },
    { label: 'Business Judgment', key: 'businessJudgment' as const },
    { label: 'Creativity', key: 'creativity' as const },
    { label: 'Communication', key: 'communication' as const },
    { label: 'Hypothesis-Driven', key: 'hypothesis' as const },
  ];

  const transcriptItems = [
    ...report.feedback.momentsOfExcellence.map((t) => ({ type: 'excellence', text: t })),
    ...report.feedback.missedOpportunities.map((t) => ({ type: 'missed', text: t })),
    ...report.feedback.keyHypotheses.map((t) => ({ type: 'hypothesis', text: t })),
  ];

  const strokeOffset = circumference * (1 - report.overallScore / 100);

  return (
    <div className="space-y-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="label-blueprint text-on-tertiary-container font-bold mb-4 block">Interview Summary</span>
          <h1 className="power-gap-h1 text-primary">Performance Intelligence Report</h1>
          <p className="mt-6 text-lg text-secondary max-w-lg font-body leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/config"
            className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-sm hover:scale-95 transition-all duration-200"
          >
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 border border-outline-variant/15 text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all duration-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Overall Score */}
        <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl flex flex-col items-center justify-center text-center">
          <h3 className="label-blueprint mb-8">Executive Decision</h3>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
              <circle
                className="text-on-tertiary-container"
                cx="96" cy="96" fill="transparent" r="88" stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-5xl font-extrabold text-primary">{report.overallScore}%</span>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-bold text-sm">
            {gradeLabel[report.overallGrade] ?? report.overallGrade}
          </div>
          <p className="mt-6 text-sm text-secondary leading-relaxed">Your performance score based on AI-powered analysis of your interview.</p>
        </div>

        {/* Competency Matrix */}
        <div className="md:col-span-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline text-xl font-bold text-primary">Core Competency Matrix</h3>
            <span className="text-xs font-label uppercase text-secondary tracking-widest">Target Threshold: 75%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {competencyList.map((c) => {
              const comp = report.competencies[c.key];
              const warning = (comp?.score ?? 0) < 75;
              return (
                <div key={c.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-tighter">
                    <span>{c.label}</span>
                    <span>{comp?.score ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", warning ? "bg-on-tertiary-container" : "bg-primary")}
                      style={{ width: `${comp?.score ?? 0}%` }}
                    />
                  </div>
                  {comp?.flag && <p className="text-[10px] text-amber-500 font-medium">{comp.flag}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Feedback */}
        <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline text-2xl font-bold text-primary mb-8 border-b border-outline-variant/15 pb-4">Executive Feedback</h3>
          <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 scrolling-log">
            {report.feedback.strengths.length > 0 && (
              <section>
                <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What You Did Well
                </h4>
                <ul className="space-y-4 text-secondary text-sm leading-relaxed list-none">
                  {report.feedback.strengths.map((s, i) => (
                    <li key={i} className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-on-tertiary-container before:rounded-full">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {report.feedback.improvements.length > 0 && (
              <section>
                <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Specific Improvements
                </h4>
                <ul className="space-y-4 text-secondary text-sm leading-relaxed list-none">
                  {report.feedback.improvements.map((s, i) => (
                    <li key={i} className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-error before:rounded-full">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Transcript Review */}
        <div className="md:col-span-5 bg-primary p-8 rounded-xl text-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-2xl font-bold">Transcript Review</h3>
              <p className="text-slate-400 text-sm mt-1">AI-Powered behavioral analysis</p>
            </div>
            <BarChart2 className="w-6 h-6 text-on-tertiary-container" />
          </div>
          <div className="space-y-6 max-h-[450px] overflow-y-auto scrolling-log">
            {transcriptItems.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No transcript highlights available.</p>
            ) : (
              transcriptItems.map((item, i) => (
                <div key={i} className={cn(
                  "p-4 bg-white/5 rounded-lg border-l-4",
                  item.type === 'missed' ? "border-error/50" : "border-on-tertiary-container"
                )}>
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest block mb-2",
                    item.type === 'missed' ? "text-error" : "text-on-tertiary-container"
                  )}>
                    {item.type === 'excellence' ? 'Moment of Excellence' : item.type === 'missed' ? 'Missed Opportunity' : 'Key Hypothesis'}
                  </span>
                  <p className="text-sm italic leading-relaxed text-slate-300">{item.text}</p>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-8 py-4 border border-white/10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
            <ExternalLink className="w-4 h-4" />
            Full Transcript Analysis
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <Share2 className="w-6 h-6 text-on-primary-container fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-primary">Benchmark your progress</h4>
            <p className="text-xs text-secondary">Share this detailed score with your coach or colleagues.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-8 py-3 bg-white text-primary border border-outline-variant/20 font-bold rounded-lg hover:bg-surface-container-low transition-all">
            Share Progress
          </button>
          <Link
            to="/config"
            className="flex-1 md:flex-none px-10 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-all flex items-center gap-2 justify-center"
          >
            Next Case <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
