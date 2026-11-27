import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { Check, Circle, CircleDot } from 'lucide-react';
import { getRoadmap, progress } from '@/lib/data';
import { InlineCode, PageHeader } from '@/components/pages/page-header';
import { Footer } from '@/components/home/footer';

export const metadata: Metadata = pageMetadata({
  title: 'Roadmap',
  description: 'The phases of the Vex language, from the core language to the tools around it.',
  path: '/roadmap',
});

export default function RoadmapPage() {
  const phases = getRoadmap();
  const all = phases.map(progress).reduce((a, p) => ({ done: a.done + p.done, total: a.total + p.total }), { done: 0, total: 0 });
  return (
    <>
      <main>
        <PageHeader eyebrow="Project" title="Roadmap">
          The Vex language is built in phases: the core language first, then the features real programs need, then the tools
          around it. {all.done} of {all.total} planned tasks are done.
        </PageHeader>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Phases" className="hidden lg:block">
            <ol className="sticky top-24 grid gap-1 border-l border-fd-border">
              {phases.map((p) => (
                <li key={p.number}>
                  <a href={`#phase-${p.number}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-fd-muted-foreground hover:border-ocean hover:text-fd-foreground">
                    <span className="font-mono text-xs">{p.version}</span> {p.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="grid gap-14">
            {phases.map((p) => {
              const { done, total } = progress(p);
              const pct = total ? Math.round((done / total) * 100) : 0;
              const state = pct === 100 ? 'Complete' : done > 0 ? 'In progress' : 'Planned';
              return (
                <section key={p.number} id={`phase-${p.number}`} className="scroll-mt-24">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-fd-border pb-6">
                    <div>
                      <p className="mb-2 font-mono text-sm text-fd-muted-foreground">
                        Phase {p.number} · {p.version}
                      </p>
                      <h2 className="font-display text-3xl font-light tracking-tight text-fd-foreground">{p.title}</h2>
                      {p.goal && (
                        <p className="mt-2 max-w-2xl text-fd-muted-foreground">
                          <InlineCode text={p.goal} />
                        </p>
                      )}
                    </div>
                    <div className="w-48">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className={state === 'Complete' ? 'font-semibold text-emerald-600 dark:text-emerald-400' : state === 'In progress' ? 'font-semibold text-ocean dark:text-blue-400' : 'font-semibold text-fd-muted-foreground'}>{state}</span>
                        <span className="text-fd-muted-foreground">
                          {done}/{total}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-fd-muted">
                        <div className="h-full rounded-full bg-ocean" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-8">
                    {p.sections.map((s, si) => (
                      <div key={si}>
                        {s.title && <h3 className="mb-3 text-sm font-semibold tracking-wide text-fd-foreground">{s.title}</h3>}
                        <ul className="overflow-hidden rounded-xl border border-fd-border">
                          {s.tasks.map((t) => (
                            <li key={t.id} className="flex items-start gap-3 border-b border-fd-border px-4 py-3 text-sm last:border-b-0">
                              {t.status === 'done' ? (
                                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              ) : t.status === 'active' ? (
                                <CircleDot className="mt-0.5 size-4 shrink-0 text-ocean" />
                              ) : (
                                <Circle className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground/60" />
                              )}
                              <span className={`flex-1 leading-relaxed ${t.status === 'done' ? 'text-fd-muted-foreground' : 'text-fd-foreground'}`}>
                                <InlineCode text={t.text} />
                              </span>
                              <span className="shrink-0 font-mono text-xs text-fd-muted-foreground">{t.id}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
