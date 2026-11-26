'use client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface Tab {
  id: string;
  label: string;
  html: string;
  output: string;
}

/// An editor with one tab per sample, and the output the sample prints.
export function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tab = tabs[active];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-code">
      <div role="tablist" aria-label="Code samples" className="flex border-b border-slate-800 bg-[#0f172a] px-2">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'relative px-4 py-3 text-[13px] font-medium transition-colors',
              i === active ? 'text-white' : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {t.label}
            {i === active && <motion.span layoutId="tab-underline" className="absolute inset-x-3 -bottom-px h-0.5 bg-sky" />}
          </button>
        ))}
      </div>
      <div className="relative h-[372px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="vx-code h-full overflow-auto px-6 py-5 text-[13.5px] leading-[23px]"
            dangerouslySetInnerHTML={{ __html: tab.html }}
          />
        </AnimatePresence>
      </div>
      <div className="border-t border-slate-800 bg-term px-6 py-4">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">Output</p>
        <pre className="min-h-[92px] font-mono text-[13px] leading-[23px] text-slate-300">{tab.output}</pre>
      </div>
    </div>
  );
}
