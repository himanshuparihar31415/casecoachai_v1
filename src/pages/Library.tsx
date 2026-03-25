import React, { useEffect, useState } from 'react';
import { Search, Bookmark, Star, Calendar, Bolt, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { api } from '@/src/lib/api';

interface CaseDoc {
  _id: string;
  title: string;
  type: string;
  industry: string;
  difficulty: number;
  description: string;
}

const difficultyDuration: Record<number, string> = {
  1: '25 MIN',
  2: '35 MIN',
  3: '45 MIN',
  4: '50 MIN',
};

export default function Library() {
  const [cases, setCases] = useState<CaseDoc[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Recommended for You');
  const [filterType, setFilterType] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [page, setPage] = useState(1);

  const tabs = ['Recommended for You', 'Most Popular', 'New Releases'];

  const fetchCases = async (resetPage = false) => {
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    const params = new URLSearchParams({ limit: '12', page: String(currentPage) });
    if (filterType) params.set('type', filterType);
    if (filterIndustry) params.set('industry', filterIndustry);
    if (filterDifficulty) params.set('difficulty', filterDifficulty);

    try {
      const data = await api.get<{ cases: CaseDoc[]; total: number }>(`/cases?${params}`);
      if (data.cases.length === 0 && currentPage === 1) {
        // Seed then refetch
        await api.post('/cases/seed');
        const seeded = await api.get<{ cases: CaseDoc[]; total: number }>(`/cases?${params}`);
        setCases(seeded.cases);
        setTotal(seeded.total);
      } else {
        setCases((prev) => (resetPage || currentPage === 1) ? data.cases : [...prev, ...data.cases]);
        setTotal(data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases(true);
  }, [filterType, filterIndustry, filterDifficulty]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCases();
  };

  return (
    <div className="space-y-16">
      {/* Hero & Search */}
      <section className="text-center space-y-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="power-gap-h1 text-primary mb-4">The Case Library</h1>
          <p className="text-secondary text-lg">Hone your analytical precision with our curated collection of executive interview simulations.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-surface-container-lowest p-2 rounded-xl border-b-2 border-surface-container-high transition-all focus-within:border-on-tertiary-container shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 w-full">
              <Search className="w-5 h-5 text-secondary" />
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-primary placeholder:text-outline py-3"
                placeholder="Search by firm, industry, or topic..."
                type="text"
              />
            </div>
            <div className="h-8 w-px bg-outline-variant/30 hidden md:block" />
            <div className="flex items-center gap-2 px-2 w-full md:w-auto overflow-x-auto scrolling-log">
              <select
                className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Type</option>
                <option value="market_entry">Market Entry</option>
                <option value="profitability">Profitability</option>
                <option value="ma">M&A</option>
                <option value="growth">Growth</option>
                <option value="pricing">Pricing</option>
                <option value="operations">Operations</option>
              </select>
              <select
                className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2"
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
              >
                <option value="">Industry</option>
                <option value="tech">Technology</option>
                <option value="cpg">CPG</option>
                <option value="pharma">Pharma</option>
                <option value="finance">Finance</option>
                <option value="energy">Energy</option>
                <option value="automotive">Automotive</option>
                <option value="retail">Retail</option>
              </select>
              <select
                className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="">Difficulty</option>
                <option value="1">Beginner</option>
                <option value="2">Intermediate</option>
                <option value="3">Advanced</option>
                <option value="4">Expert</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="flex items-center gap-12 border-b border-outline-variant/15 overflow-x-auto scrolling-log">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 border-b-2 transition-all whitespace-nowrap font-label text-sm",
                activeTab === tab
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-secondary font-medium hover:text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Case Grid */}
      {loading && cases.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-on-tertiary-container" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c._id} className="group relative bg-surface-container-lowest p-6 rounded-lg transition-all hover:translate-y-[-4px] border border-transparent hover:border-on-tertiary-container/20">
              <div className="flex justify-between items-start mb-6">
                <span className="px-2 py-1 text-[10px] font-label font-bold uppercase tracking-wider rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  NEW
                </span>
                <Bookmark className="w-5 h-5 transition-colors text-outline-variant group-hover:text-on-tertiary-container" />
              </div>

              <h3 className="font-headline text-xl font-bold text-primary mb-2">{c.title}</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-label text-secondary uppercase tracking-tight">
                    <Bolt className="w-3 h-3" /> {c.industry}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-label text-secondary uppercase tracking-tight">
                    <Calendar className="w-3 h-3" /> {difficultyDuration[c.difficulty] ?? '40 MIN'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex text-on-tertiary-container">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-3 h-3", i < Math.min(c.difficulty + 2, 5) ? "fill-current" : "text-outline-variant")}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/95 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <Link
                  to="/config"
                  className="w-48 py-3 bg-on-tertiary-container text-white text-center font-bold rounded-md active:scale-95 transition-all"
                >
                  Quick Start
                </Link>
                <button className="w-48 py-3 bg-transparent border border-white/30 text-white font-medium rounded-md hover:bg-white/10 active:scale-95 transition-all">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Pagination */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <p className="text-sm font-label text-secondary uppercase tracking-widest">
          Showing {cases.length} of {total} available cases
        </p>
        {cases.length < total && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-headline font-bold rounded-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Load More Cases
          </button>
        )}
      </div>
    </div>
  );
}
