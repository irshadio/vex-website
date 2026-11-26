import { getBenchmarks } from '@/lib/data';
import { formatBytes, formatTime } from '@/lib/format';
import { Reveal } from './reveal';
import { Section } from './section';

const columns = [
  { id: 'fib', label: 'Calls' },
  { id: 'sieve', label: 'Arrays' },
  { id: 'trees', label: 'Allocation' },
  { id: 'hello', label: 'Start-up' },
];

/// A summary table of every benchmark, linking to the full results.
export function Performance() {
  const data = getBenchmarks();
  if (!data) return null;
  const result = (bench: string, lang: string) => data.results.find((r) => r.benchmark === bench && r.language === lang);
  const best = Object.fromEntries(columns.map((c) => [c.id, Math.min(...data.results.filter((r) => r.benchmark === c.id).map((r) => r.mean))]));
  const vexSize = result('hello', 'vex')?.size;
  return (
    <Section
      eyebrow="Performance"
      title="Native speed, small binaries"
      sub="Measured against popular languages on the same programs. Vex starts instantly, ships tiny executables and runs close to C on function calls."
      action={{ label: 'Full results and method', href: '/benchmarks' }}
    >
      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-x-auto rounded-xl border border-fd-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-fd-border bg-fd-card text-left text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  <th className="px-4 py-3">Language</th>
                  {columns.map((c) => (
                    <th key={c.id} className="px-4 py-3 text-right">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Binary</th>
                </tr>
              </thead>
              <tbody>
                {data.languages.map((l) => {
                  const isVex = l.id === 'vex';
                  const size = result('hello', l.id)?.size;
                  return (
                    <tr key={l.id} className={`border-b border-fd-border last:border-b-0 ${isVex ? 'bg-blue-50/70 dark:bg-blue-950/40' : ''}`}>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className={isVex ? 'font-semibold text-fd-foreground' : 'text-fd-foreground'}>{l.name}</span>
                        {l.note && <span className="ml-1.5 text-xs text-fd-muted-foreground">{l.note}</span>}
                      </td>
                      {columns.map((c) => {
                        const r = result(c.id, l.id);
                        const isBest = r && r.mean === best[c.id];
                        return (
                          <td key={c.id} className={`px-4 py-2.5 text-right font-mono whitespace-nowrap tabular-nums ${isBest ? 'font-semibold text-emerald-700 dark:text-emerald-400' : isVex ? 'text-fd-foreground' : 'text-fd-muted-foreground'}`}>
                            {r ? formatTime(r.mean) : 'n/a'}
                          </td>
                        );
                      })}
                      <td className={`px-4 py-2.5 text-right font-mono whitespace-nowrap tabular-nums ${isVex ? 'text-fd-foreground' : 'text-fd-muted-foreground'}`}>{size ? formatBytes(size) : 'runtime'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid content-start gap-4">
            {vexSize && (
              <div className="rounded-xl border border-fd-border p-5">
                <p className="font-display text-4xl font-light tracking-tight text-ocean dark:text-blue-400">{formatBytes(vexSize)}</p>
                <p className="mt-1 text-sm font-semibold text-fd-foreground">Hello world binary</p>
                <p className="mt-1 text-sm text-fd-muted-foreground">A complete native executable, with the garbage collector built in.</p>
              </div>
            )}
            <div className="rounded-xl border border-fd-border p-5 text-sm leading-relaxed text-fd-muted-foreground">
              Mean wall-clock time, lower is better. The fastest result in each column is in green. {data.machine.cpu}, {data.machine.os}, measured{' '}
              {data.date}.
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
