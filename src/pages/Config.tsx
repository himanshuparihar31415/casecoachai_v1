import React, { useState } from 'react';
import { Compass, TrendingUp, Handshake, Settings, DollarSign, Info, ArrowRight, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { api } from '@/src/lib/api';

const archetypes = [
  { id: 'profitability', title: 'Profitability', desc: 'Diagnose declining margins and optimize cost structures.', icon: <DollarSign className="w-8 h-8" /> },
  { id: 'market_entry', title: 'Market Entry', desc: 'Assess attractiveness and define GTM strategy for new territories.', icon: <Compass className="w-8 h-8" /> },
  { id: 'ma', title: 'M&A', desc: 'Evaluate synergy potential and strategic fit for acquisitions.', icon: <Handshake className="w-8 h-8" /> },
  { id: 'growth', title: 'Growth', desc: 'Identify levers to scale revenue and capture market share.', icon: <TrendingUp className="w-8 h-8" /> },
  { id: 'pricing', title: 'Pricing', desc: 'Develop elasticity models and tiered pricing architectures.', icon: <DollarSign className="w-8 h-8" /> },
  { id: 'operations', title: 'Operations', desc: 'Streamline supply chains and improve process efficiency.', icon: <Settings className="w-8 h-8" /> },
];

const industries = ['Tech', 'CPG', 'Pharma', 'Finance', 'Energy', 'Automotive', 'Retail'];

const styleMap: Record<string, string> = {
  'Supportive': 'supportive',
  'Neutral': 'neutral',
  'Stress Interview': 'stress',
};

export default function Config() {
  const navigate = useNavigate();
  const [selectedArchetype, setSelectedArchetype] = useState('market_entry');
  const [selectedIndustry, setSelectedIndustry] = useState('Pharma');
  const [difficulty, setDifficulty] = useState(3);
  const [interviewerStyle, setInterviewerStyle] = useState('Neutral');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBeginCase = async () => {
    setLoading(true);
    setError('');
    try {
      const { case: caseDoc } = await api.post<{ case: { _id: string } }>('/cases/generate', {
        type: selectedArchetype,
        industry: selectedIndustry.toLowerCase(),
        difficulty,
      });

      const sessionData = await api.post<{ session: { _id: string } }>('/sessions', {
        caseId: caseDoc._id,
        config: {
          difficulty,
          industry: selectedIndustry.toLowerCase(),
          caseType: selectedArchetype,
          interviewerStyle: styleMap[interviewerStyle] ?? 'neutral',
          durationMinutes: 45,
        },
      });

      navigate(`/session/${sessionData.session._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-20">
      {/* Header Section */}
      <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="label-blueprint text-on-tertiary-container font-bold mb-4 block">Simulation Module 04</span>
          <h1 className="power-gap-h1 text-primary mb-6"> Configure Your <br /> Case Session. </h1>
          <p className="font-body text-secondary text-lg max-w-lg leading-relaxed">
            Select the parameters for your session. Our AI engine will synthesize a unique case based on real-world market shifts and data sets.
          </p>
        </div>
        <div className="hidden lg:block w-48 h-1 bg-primary/10 mb-2" />
      </header>

      {/* Configuration Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Step Navigation */}
        <aside className="lg:col-span-3 space-y-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm shadow-lg">01</div>
              <div>
                <p className="label-blueprint text-on-tertiary-container font-bold">Step One</p>
                <p className="font-headline font-bold text-primary group-hover:text-on-tertiary-container transition-colors">Case Archetype</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-secondary font-bold text-sm">02</div>
              <div>
                <p className="label-blueprint font-bold">Step Two</p>
                <p className="font-headline font-bold text-primary">Market Sector</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-secondary font-bold text-sm">03</div>
              <div>
                <p className="label-blueprint font-bold">Step Three</p>
                <p className="font-headline font-bold text-primary">Simulation Rigor</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Config Area */}
        <div className="lg:col-span-9 space-y-24">
          {/* Case Type Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-2xl font-bold text-primary">Select Case Type</h2>
              <span className="text-on-tertiary-container font-label text-xs font-bold uppercase tracking-widest">Required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archetypes.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedArchetype(a.id)}
                  className={cn(
                    "p-8 cursor-pointer transition-all border-b-4 group",
                    selectedArchetype === a.id
                      ? "bg-primary border-on-tertiary-container shadow-2xl"
                      : "bg-surface-container-lowest border-transparent hover:bg-surface-container-low hover:border-on-tertiary-container"
                  )}
                >
                  <div className={cn(
                    "mb-6 block transition-transform group-hover:scale-110",
                    selectedArchetype === a.id ? "text-on-tertiary-container" : "text-primary"
                  )}>
                    {a.icon}
                  </div>
                  <h3 className={cn("font-headline font-bold mb-2", selectedArchetype === a.id ? "text-white" : "text-primary")}>
                    {a.title}
                  </h3>
                  <p className={cn("font-body text-xs leading-relaxed", selectedArchetype === a.id ? "text-on-primary-container" : "text-secondary")}>
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Industry Filters */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-8">Select Industry</h2>
            <div className="flex flex-wrap gap-3">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={cn(
                    "px-6 py-2 rounded-full font-label text-xs font-bold uppercase tracking-widest transition-all",
                    selectedIndustry === ind
                      ? "bg-primary text-white shadow-lg"
                      : "border border-outline-variant text-secondary hover:border-primary"
                  )}
                >
                  {ind}
                </button>
              ))}
            </div>
          </section>

          {/* Difficulty & Style */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary mb-10">Difficulty Level</h2>
              <div className="relative px-2">
                <input
                  className="w-full appearance-none bg-surface-container h-1 rounded-full cursor-pointer accent-on-tertiary-container"
                  max="4" min="1" step="1" type="range"
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-6 text-[10px] font-label font-bold uppercase tracking-widest text-secondary">
                  <span className={difficulty === 1 ? "text-on-tertiary-container" : "opacity-50"}>Beginner</span>
                  <span className={difficulty === 2 ? "text-on-tertiary-container" : "opacity-50"}>Intermediate</span>
                  <span className={difficulty === 3 ? "text-on-tertiary-container" : "opacity-50"}>Advanced</span>
                  <span className={difficulty === 4 ? "text-on-tertiary-container" : "opacity-50"}>Expert</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-headline text-2xl font-bold text-primary mb-8">Interviewer Style</h2>
              <div className="space-y-3">
                {['Supportive', 'Neutral', 'Stress Interview'].map((style) => (
                  <div
                    key={style}
                    onClick={() => setInterviewerStyle(style)}
                    className={cn(
                      "flex items-center justify-between p-4 bg-surface-container-lowest border cursor-pointer transition-all",
                      interviewerStyle === style
                        ? "border-on-tertiary-container shadow-sm"
                        : "border-outline-variant/30 hover:border-on-tertiary-container"
                    )}
                  >
                    <span className="font-body font-semibold text-primary">{style}</span>
                    {interviewerStyle === style ? (
                      <CheckCircle className="w-5 h-5 text-on-tertiary-container fill-current" />
                    ) : (
                      <Circle className="w-5 h-5 text-outline-variant" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Action Bar */}
          <section className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-outline-variant/20 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 text-secondary">
                <Info className="w-5 h-5" />
                <p className="font-body text-sm italic">Session will take approximately 45 minutes to complete.</p>
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
            <button
              onClick={handleBeginCase}
              disabled={loading}
              className="bg-gradient-to-br from-primary to-primary-container text-white px-12 py-5 rounded-md font-headline font-bold text-lg tracking-tight hover:scale-95 transition-transform shadow-2xl flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Case...
                </>
              ) : (
                <>
                  Begin Case
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
