import React from 'react';
import { CheckCircle, AlertCircle, Share2, ArrowRight, ExternalLink, BarChart2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const competencies = [
  { label: 'Structure', value: 95 },
  { label: 'Math Accuracy', value: 70, warning: true },
  { label: 'Business Judgment', value: 88 },
  { label: 'Creativity', value: 82 },
  { label: 'Communication', value: 90 },
  { label: 'Hypothesis-Driven', value: 78, warning: true },
];

export default function Report() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="label-blueprint text-on-tertiary-container font-bold mb-4 block">Interview Summary</span>
          <h1 className="power-gap-h1 text-primary">Performance Intelligence Report</h1>
          <p className="mt-6 text-lg text-secondary max-w-lg font-body leading-relaxed">
            Based on your McKinsey-style case analysis for <span className="text-primary font-semibold">Global Logistics Optimization</span>. High scores in structural clarity, with opportunities in rapid mental math.
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
            to="/"
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
                strokeDasharray="552.9" 
                strokeDashoffset={552.9 * (1 - 0.84)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-5xl font-extrabold text-primary">84%</span>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-bold text-sm">
            STRONG PASS
          </div>
          <p className="mt-6 text-sm text-secondary leading-relaxed">Your performance aligns with the 92nd percentile of successful candidates in this sector.</p>
        </div>

        {/* Competency Matrix */}
        <div className="md:col-span-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline text-xl font-bold text-primary">Core Competency Matrix</h3>
            <span className="text-xs font-label uppercase text-secondary tracking-widest">Target Threshold: 75%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {competencies.map((c) => (
              <div key={c.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-tighter">
                  <span>{c.label}</span>
                  <span>{c.value}%</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", c.warning ? "bg-on-tertiary-container" : "bg-primary")} 
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Feedback */}
        <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline text-2xl font-bold text-primary mb-8 border-b border-outline-variant/15 pb-4">Executive Feedback</h3>
          <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 scrolling-log">
            <section>
              <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                What You Did Well
              </h4>
              <ul className="space-y-4 text-secondary text-sm leading-relaxed list-none">
                <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-on-tertiary-container before:rounded-full">
                  <strong className="text-primary">Superior Framework Development:</strong> Your MECE structure for the logistics entry strategy was exceptionally comprehensive, covering both upstream supply chain risks and downstream customer acquisition costs.
                </li>
                <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-on-tertiary-container before:rounded-full">
                  <strong className="text-primary">Executive Presence:</strong> You maintained a steady pace and clear synthesis points at the end of every mathematical exhibit.
                </li>
              </ul>
            </section>
            <section>
              <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Specific Improvements
              </h4>
              <ul className="space-y-4 text-secondary text-sm leading-relaxed list-none">
                <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-error before:rounded-full">
                  <strong className="text-primary">Mental Math Speed:</strong> During the Market Sizing segment, the calculation for the European TAM took 45 seconds longer than the average candidate. Practice unit conversions.
                </li>
                <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-error before:rounded-full">
                  <strong className="text-primary">Initial Hypothesis:</strong> You waited until Exhibit 3 to state a clear hypothesis. In the future, state your leaning immediately after the framework.
                </li>
              </ul>
            </section>
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
            {[
              { type: 'excellence', time: '08:14', text: '"Looking at this data, while the fixed costs are high, the scalable nature of the platform suggests that we should focus on volume over margin in Year 1..."', insight: 'Strong business judgment shown during the chart synthesis.' },
              { type: 'missed', time: '14:30', text: '"The total revenue would be... let me just re-calculate that... it\'s about $450M. No, wait, $4.5B."', insight: 'Decimal point error. Remember to use \'sanity checks\' for magnitude.' },
              { type: 'hypothesis', time: '02:45', text: '"My initial hypothesis is that the profitability issue stems from logistics inefficiencies rather than pricing strategy..."', insight: 'Correctly identified the core lever early in the case.' },
            ].map((item, i) => (
              <div key={i} className={cn(
                "p-4 bg-white/5 rounded-lg border-l-4",
                item.type === 'missed' ? "border-error/50" : "border-on-tertiary-container"
              )}>
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-widest block mb-2",
                  item.type === 'missed' ? "text-error" : "text-on-tertiary-container"
                )}>
                  {item.type === 'excellence' ? 'Moment of Excellence' : item.type === 'missed' ? 'Missed Opportunity' : 'Key Hypothesis'} ({item.time})
                </span>
                <p className="text-sm italic leading-relaxed text-slate-300">{item.text}</p>
                <p className={cn(
                  "text-[11px] mt-2 font-semibold",
                  item.type === 'missed' ? "text-error/80" : "text-on-tertiary-container"
                )}>Insight: {item.insight}</p>
              </div>
            ))}
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
          <button className="flex-1 md:flex-none px-10 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-all">
            Next Case
          </button>
        </div>
      </div>
    </div>
  );
}
