'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';

/// Highlighted source files, one tab per language.
export function SourceTabs({ files }: { files: { id: string; label: string; file: string; html: string }[] }) {
  const [active, setActive] = useState(0);
  const f = files[active];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-code">
      <div role="tablist" className="flex overflow-x-auto border-b border-slate-800 bg-[#0f172a] px-2">
        {files.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors',
              i === active ? 'border-sky text-white' : 'border-transparent text-slate-400 hover:text-slate-200',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="border-b border-slate-800 px-5 py-2 font-mono text-xs text-slate-500">{f.file}</p>
      <div className="vx-code max-h-[420px] overflow-auto px-5 py-4 text-[13px] leading-[22px]" dangerouslySetInnerHTML={{ __html: f.html }} />
    </div>
  );
}
