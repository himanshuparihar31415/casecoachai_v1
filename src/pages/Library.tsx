import React, { useState } from 'react';
import { Search, Bookmark, Star, Briefcase, Calendar, Activity, Landmark, Car, ShoppingBag, Bolt } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const cases = [
  {
    id: 1,
    title: 'Sustainable Aviation Fuel Strategy',
    industry: 'Aerospace',
    duration: '35 MIN',
    rating: 4,
    status: 'NEW',
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    id: 2,
    title: 'Digital Health Platform Entry',
    industry: 'Healthcare',
    duration: '45 MIN',
    rating: 5,
    status: 'IN PROGRESS',
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    id: 3,
    title: 'Retail Banking Fintech M&A',
    industry: 'Finance',
    duration: '30 MIN',
    rating: 3,
    status: 'COMPLETED',
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    id: 4,
    title: 'Electric Vehicle Battery Sourcing',
    industry: 'Automotive',
    duration: '40 MIN',
    rating: 4,
    status: 'NEW',
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    id: 5,
    title: 'Premium Coffee Subscription Growth',
    industry: 'Retail',
    duration: '25 MIN',
    rating: 3,
    status: 'NEW',
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    id: 6,
    title: 'Green Energy Infrastructure ROI',
    industry: 'Energy',
    duration: '50 MIN',
    rating: 5,
    status: 'COMPLETED',
    icon: <Bolt className="w-4 h-4" />,
  },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState('Recommended for You');

  const tabs = ['Recommended for You', 'Most Popular', 'New Releases'];

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
              <select className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2">
                <option>Type</option>
                <option>Market Entry</option>
                <option>Profitability</option>
                <option>M&A</option>
              </select>
              <select className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2">
                <option>Industry</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
              </select>
              <select className="bg-transparent border-none text-sm font-label font-semibold text-secondary focus:ring-0 cursor-pointer py-2">
                <option>Difficulty</option>
                <option>Beginner</option>
                <option>Advanced</option>
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cases.map((c) => (
          <div key={c.id} className="group relative bg-surface-container-lowest p-6 rounded-lg transition-all hover:translate-y-[-4px] border border-transparent hover:border-on-tertiary-container/20">
            <div className="flex justify-between items-start mb-6">
              <span className={cn(
                "px-2 py-1 text-[10px] font-label font-bold uppercase tracking-wider rounded",
                c.status === 'NEW' ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" :
                c.status === 'IN PROGRESS' ? "bg-secondary-container text-on-secondary-container" :
                "bg-surface-container text-secondary"
              )}>
                {c.status}
              </span>
              <Bookmark className={cn(
                "w-5 h-5 transition-colors",
                c.status === 'IN PROGRESS' ? "text-on-tertiary-container fill-current" : "text-outline-variant group-hover:text-on-tertiary-container"
              )} />
            </div>
            
            <h3 className="font-headline text-xl font-bold text-primary mb-2">{c.title}</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-label text-secondary uppercase tracking-tight">
                  <Bolt className="w-3 h-3" /> {c.industry}
                </span>
                <span className="flex items-center gap-1 text-xs font-label text-secondary uppercase tracking-tight">
                  <Calendar className="w-3 h-3" /> {c.duration}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex text-on-tertiary-container">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn("w-3 h-3", i < c.rating ? "fill-current" : "text-outline-variant")} 
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
                {c.status === 'IN PROGRESS' ? 'Resume Session' : 'Quick Start'}
              </Link>
              <button className="w-48 py-3 bg-transparent border border-white/30 text-white font-medium rounded-md hover:bg-white/10 active:scale-95 transition-all">
                {c.status === 'COMPLETED' ? 'Review Feedback' : 'Save for Later'}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <p className="text-sm font-label text-secondary uppercase tracking-widest">Showing 6 of 124 available cases</p>
        <button className="px-8 py-3 bg-primary text-white font-headline font-bold rounded-md hover:shadow-lg transition-all active:scale-95">
          Load More Cases
        </button>
      </div>
    </div>
  );
}
