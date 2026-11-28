import type { ReactNode } from 'react';

/// One row of a [StatusList].
export interface StatusItem {
  title: string;
  detail: ReactNode;
  status: 'Available' | 'Planned' | 'Spike';
}

const badge = {
  Available: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Planned: 'bg-fd-muted text-fd-muted-foreground',
  Spike: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
};

/// A bordered list of features, each with a status badge and optional step numbers.
export function StatusList({ items, numbered = false }: { items: StatusItem[]; numbered?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-fd-border">
      {items.map((item, i) => (
        <div key={item.title} className="flex items-center gap-4 border-b border-fd-border px-5 py-4 last:border-b-0">
          {numbered && <span className="font-mono text-[13px] text-ocean dark:text-blue-400">{String(i + 1).padStart(2, '0')}</span>}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-fd-foreground">{item.title}</p>
            <p className="text-sm text-fd-muted-foreground">{item.detail}</p>
          </div>
          <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${badge[item.status]}`}>{item.status}</span>
        </div>
      ))}
    </div>
  );
}

/// A dark code card with a file name and a label in its title bar.
export function CodeCard({ file, label, children }: { file: string; label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-code">
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-5 py-3">
        <span className="font-mono text-[13px] text-slate-300">{file}</span>
        <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">{label}</span>
      </div>
      {children}
    </div>
  );
}
