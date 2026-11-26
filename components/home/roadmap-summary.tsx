import { getRoadmap, progress } from '@/lib/data';
import { Reveal } from './reveal';
import { Section } from './section';

/// Progress of each roadmap phase.
export function RoadmapSummary() {
  const phases = getRoadmap();
  if (!phases.length) return null;
  return (
    <Section eyebrow="Roadmap" title="Where Vex is going" sub="The language is built in phases, from the core language to the tools around it." action={{ label: 'Full roadmap', href: '/roadmap' }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.slice(0, 3).map((p, i) => {
          const { done, total } = progress(p);
          const pct = total ? Math.round((done / total) * 100) : 0;
          const state = pct === 100 ? 'Complete' : done > 0 ? 'In progress' : 'Planned';
          return (
            <Reveal key={p.number} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl border border-fd-border p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-fd-muted-foreground">{p.version}</span>
                  <span className={`text-xs font-semibold ${state === 'Complete' ? 'text-emerald-600 dark:text-emerald-400' : state === 'In progress' ? 'text-ocean dark:text-blue-400' : 'text-fd-muted-foreground'}`}>{state}</span>
                </div>
                <p className="mb-1 font-semibold text-fd-foreground">{p.title}</p>
                <p className="mb-5 flex-1 text-sm text-fd-muted-foreground">{p.goal ?? ''}</p>
                <div className="h-1.5 rounded-full bg-fd-muted">
                  <div className="h-full rounded-full bg-ocean" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-fd-muted-foreground">
                  {done} of {total} tasks
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
