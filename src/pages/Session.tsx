import React from 'react';
import { MicOff, PhoneOff, Lightbulb, Timer } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Session() {
  return (
    <div className="grid grid-cols-12 gap-12 flex-grow items-stretch py-8">
      {/* Left Sidebar */}
      <aside className="col-span-12 lg:col-span-3 space-y-8 flex flex-col">
        <section>
          <label className="label-blueprint mb-4 block">Current Scenario</label>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
            <h2 className="font-headline font-bold text-lg text-primary mb-2">Global Logistics Expansion</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              A Tier-1 ocean freight company is looking to enter the cold-chain pharmaceutical market.
            </p>
          </div>
        </section>

        <section className="flex-grow">
          <label className="label-blueprint mb-4 block">Key Data Points</label>
          <div className="space-y-4">
            {[
              { label: 'Annual Revenue', value: '$5.2B' },
              { label: 'Market Share', value: '12%' },
              { label: 'Growth Target', value: '+15%', highlight: true },
              { label: 'Capex Limit', value: '$450M' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-end border-b border-outline-variant/15 pb-2">
                <span className="text-xs text-on-surface-variant">{item.label}</span>
                <span className={cn("font-headline font-bold", item.highlight ? "text-on-tertiary-container" : "text-primary")}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-surface-container-high hover:bg-surface-container transition-all text-primary font-headline font-bold text-sm rounded-lg group">
            <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Request Hint
          </button>
        </div>
      </aside>

      {/* Center: Voice Interaction */}
      <section className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center py-12 relative">
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20 pointer-events-none">
          <div className="w-[400px] h-[400px] bg-on-tertiary-container blur-[120px] rounded-full" />
        </div>

        <div className="text-center space-y-12 w-full max-w-md">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container" />
              </span>
              <span className="label-blueprint text-on-tertiary-container font-bold">AI is listening...</span>
            </div>
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-primary">The Partner is analyzing your response</h1>
          </div>

          {/* Voice Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-20">
            {[12, 24, 48, 64, 32, 56, 18, 42, 28, 14].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: h }}
                animate={{ height: [h, h * 1.5, h * 0.5, h] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>

          <div className="flex justify-center gap-6 pt-8">
            <button className="w-16 h-16 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-all flex items-center justify-center shadow-sm">
              <MicOff className="w-7 h-7" />
            </button>
            <Link 
              to="/report"
              className="px-8 py-4 bg-primary text-on-primary font-headline font-bold rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Stop and Submit
            </Link>
            <button className="w-16 h-16 rounded-full bg-error-container text-on-error-container hover:bg-error/10 transition-all flex items-center justify-center shadow-sm">
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Transcript */}
      <aside className="col-span-12 lg:col-span-3 flex flex-col py-8">
        <label className="label-blueprint mb-4 block">Conversation Log</label>
        <div className="flex-grow scrolling-log overflow-y-auto space-y-6 pr-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-on-tertiary-container">PARTNER (AI)</div>
            <div className="bg-surface-container-low p-4 rounded-lg text-sm text-on-surface-variant leading-relaxed italic">
              "Given the current competitive landscape, how would you approach the cold-chain infrastructure investment?"
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-primary">CANDIDATE (YOU)</div>
            <div className="bg-surface-container-lowest p-4 rounded-lg text-sm text-primary leading-relaxed border border-outline-variant/10">
              "I would first evaluate the geographic concentration of our primary pharmaceutical clients and compare the cost of greenfield construction versus acquisition of mid-size regional players."
            </div>
          </div>

          <div className="flex items-center gap-2 py-4">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-on-tertiary-container rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-on-tertiary-container rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-on-tertiary-container rounded-full animate-pulse delay-150" />
            </div>
            <span className="text-[10px] text-secondary font-medium italic">Transcription in progress...</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
