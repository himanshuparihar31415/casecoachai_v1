import React from 'react';
import { Play, Download } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const trendData = [
  { session: '01', accuracy: 40 },
  { session: '02', accuracy: 45 },
  { session: '03', accuracy: 38 },
  { session: '04', accuracy: 55 },
  { session: '05', accuracy: 62 },
  { session: '06', accuracy: 58 },
  { session: '07', accuracy: 75 },
  { session: '08', accuracy: 82 },
  { session: '09', accuracy: 78 },
  { session: '10', accuracy: 90 },
];

const metrics = [
  { label: 'Structure', value: 82 },
  { label: 'Math', value: 74 },
  { label: 'Business Judgment', value: 88 },
  { label: 'Communication', value: 92 },
];

const strategicFocus = [
  { label: 'Market Sizing', value: 64 },
  { label: 'M&A Synergies', value: 48 },
  { label: 'Profitability Drills', value: 72 },
];

const caseHistory = [
  { name: 'Urban Mobility Electrification', type: 'Market Entry', status: 'Completed', score: '88/100', date: 'Oct 24, 2024' },
  { name: 'Global Pharma Supply Chain', type: 'Operations', status: 'Completed', score: '92/100', date: 'Oct 22, 2024' },
  { name: 'Fintech Series B Valuation', type: 'M&A Strategy', status: 'In Progress', score: '-', date: 'Oct 21, 2024' },
  { name: 'Renewable Energy Portfolio', type: 'Private Equity', status: 'Completed', score: '76/100', date: 'Oct 19, 2024' },
];

export default function Dashboard() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl">
          <span className="label-blueprint mb-4 block">Candidate Overview</span>
          <h1 className="power-gap-h1 text-primary mb-6">
            Welcome back, <br />
            <span className="text-on-tertiary-container">John!</span>
          </h1>
          <p className="font-body text-secondary text-lg max-w-md">
            Your trajectory suggests a high probability of success for MBB interviews. Continue your momentum.
          </p>
        </div>
        <Link 
          to="/config"
          className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-md shadow-lg shadow-primary/10 hover:scale-[0.98] transition-transform flex items-center justify-center gap-3"
        >
          Start New Session
          <Play className="w-5 h-5 fill-current" />
        </Link>
      </section>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between border border-outline-variant/15 group hover:bg-primary transition-colors duration-300">
            <span className="label-blueprint group-hover:text-on-primary-container transition-colors">{m.label}</span>
            <div className="mt-8">
              <div className="text-4xl font-headline font-extrabold text-primary group-hover:text-white transition-colors">{m.value}%</div>
              <div className="h-1 w-full bg-surface-container mt-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-on-tertiary-container transition-all duration-500" 
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary">Performance Trend</h3>
              <p className="font-body text-secondary text-sm">Aggregated session data (Last 10 sessions)</p>
            </div>
            <div className="flex items-center gap-2 text-on-tertiary-container font-label text-xs font-bold uppercase tracking-wider">
              <span className="w-3 h-3 rounded-full bg-on-tertiary-container" />
              Executive Accuracy
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <Bar 
                  dataKey="accuracy" 
                  fill="#08aae4" 
                  radius={[2, 2, 0, 0]}
                  opacity={0.8}
                />
                <XAxis dataKey="session" hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 label-blueprint border-t border-outline-variant/10 pt-4">
            <span>Session 01</span>
            <span>Session 10</span>
          </div>
        </div>

        {/* Strategic Focus */}
        <div className="bg-surface-container-low rounded-xl p-10">
          <h3 className="font-headline text-2xl font-bold text-primary mb-8">Strategic Focus</h3>
          <div className="space-y-10">
            {strategicFocus.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-3">
                  <span className="font-body font-bold text-primary text-sm">{item.label}</span>
                  <span className="font-label text-on-tertiary-container font-bold text-xs">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link 
            to="/library"
            className="mt-12 block w-full py-3 text-center border border-outline-variant/20 rounded-md font-label text-[11px] font-bold text-primary uppercase tracking-[0.1em] hover:bg-surface-container-high transition-colors"
          >
            View Drill Library
          </Link>
        </div>
      </div>

      {/* Case Audit History */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-headline text-2xl font-bold text-primary">Case Audit History</h3>
          <button className="text-on-tertiary-container font-label text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-70 transition-opacity">
            Export Report
            <Download className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="label-blueprint border-b border-outline-variant/5">
                <th className="px-8 py-6">Case Name</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Score</th>
                <th className="px-8 py-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-primary divide-y divide-outline-variant/5">
              {caseHistory.map((item) => (
                <tr key={item.name} className="hover:bg-surface-container transition-colors group">
                  <td className="px-8 py-6 font-bold">{item.name}</td>
                  <td className="px-8 py-6 text-secondary">{item.type}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                      item.status === 'Completed' ? "bg-secondary-container text-on-secondary-fixed-variant" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-headline font-extrabold text-on-tertiary-container">{item.score}</td>
                  <td className="px-8 py-6 text-right text-secondary">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-surface-container-low text-center">
          <button className="font-label text-xs font-bold text-secondary uppercase tracking-widest hover:text-primary transition-colors">
            Load Full Case History
          </button>
        </div>
      </section>
    </div>
  );
}
