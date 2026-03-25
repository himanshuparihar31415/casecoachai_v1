import React, { useRef, useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/lib/api';

interface CaseDoc {
  _id: string;
  title: string;
  type: string;
  industry: string;
  difficulty: number;
  description: string;
}

interface Props {
  onClose: () => void;
  onCreated: (c: CaseDoc) => void;
}

type InputMode = 'text' | 'pdf';

export default function AddCaseModal({ onClose, onCreated }: Props) {
  const [mode, setMode] = useState<InputMode>('text');
  const [title, setTitle] = useState('');
  const [scenario, setScenario] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [caseType, setCaseType] = useState('');
  const [industry, setIndustry] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required.'); return; }
    if (mode === 'text' && !scenario.trim()) { setError('Scenario text is required.'); return; }
    if (mode === 'pdf' && !file) { setError('Please select a PDF file.'); return; }

    setLoading(true);
    try {
      let result: { case: CaseDoc };
      if (mode === 'pdf' && file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('title', title.trim());
        if (caseType) fd.append('type', caseType);
        if (industry) fd.append('industry', industry);
        if (difficulty) fd.append('difficulty', difficulty);
        result = await api.postForm<{ case: CaseDoc }>('/cases/custom', fd);
      } else {
        result = await api.post<{ case: CaseDoc }>('/cases/custom', {
          title: title.trim(),
          scenario: scenario.trim(),
          type: caseType || undefined,
          industry: industry || undefined,
          difficulty: difficulty ? Number(difficulty) : undefined,
        });
      }
      onCreated(result.case);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-surface-container-low rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="font-headline text-xl font-bold text-primary">Add Your Own Case</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input mode selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                mode === 'text'
                  ? 'border-on-tertiary-container bg-on-tertiary-container/10 text-primary'
                  : 'border-outline-variant/30 text-secondary hover:border-on-tertiary-container/50'
              )}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm font-label font-semibold">Paste Text</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('pdf')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                mode === 'pdf'
                  ? 'border-on-tertiary-container bg-on-tertiary-container/10 text-primary'
                  : 'border-outline-variant/30 text-secondary hover:border-on-tertiary-container/50'
              )}
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-label font-semibold">Upload PDF</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-label font-semibold text-secondary mb-1">Case Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Declining Margins at Retailer X"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-primary placeholder:text-outline focus:outline-none focus:border-on-tertiary-container"
            />
          </div>

          {/* Text input or PDF upload */}
          {mode === 'text' ? (
            <div>
              <label className="block text-sm font-label font-semibold text-secondary mb-1">Case Scenario *</label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={6}
                placeholder="Paste the full case scenario, background information, and any data provided..."
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-primary placeholder:text-outline focus:outline-none focus:border-on-tertiary-container resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-label font-semibold text-secondary mb-1">PDF File *</label>
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                  file
                    ? 'border-on-tertiary-container bg-on-tertiary-container/5 text-primary'
                    : 'border-outline-variant/30 text-secondary hover:border-on-tertiary-container/50'
                )}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-label font-medium">
                  {file ? file.name : 'Click to select a PDF (max 10 MB)'}
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          {/* Optional metadata */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-label font-semibold text-secondary mb-1">Type</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-on-tertiary-container"
              >
                <option value="">Any</option>
                <option value="profitability">Profitability</option>
                <option value="market_entry">Market Entry</option>
                <option value="ma">M&A</option>
                <option value="growth">Growth</option>
                <option value="pricing">Pricing</option>
                <option value="operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-label font-semibold text-secondary mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-on-tertiary-container"
              >
                <option value="">Any</option>
                <option value="tech">Tech</option>
                <option value="cpg">CPG</option>
                <option value="pharma">Pharma</option>
                <option value="finance">Finance</option>
                <option value="energy">Energy</option>
                <option value="automotive">Automotive</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-label font-semibold text-secondary mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-on-tertiary-container"
              >
                <option value="">Auto</option>
                <option value="1">Beginner</option>
                <option value="2">Intermediate</option>
                <option value="3">Advanced</option>
                <option value="4">Expert</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-outline-variant/30 rounded-lg text-secondary font-label font-semibold hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-on-tertiary-container text-white rounded-lg font-label font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
