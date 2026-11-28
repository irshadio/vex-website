import type { SuiteData } from '@/lib/data';
import { formatBytes } from '@/lib/format';

const ms = (x: number) => (x >= 1000 ? `${(x / 1000).toFixed(2)} s` : `${Math.round(x)} ms`);
const mb = (bytes: number) => (bytes / 1048576).toFixed(1);

/// The Vex and Go comparison over the compiler's whole benchmark suite.
export function SuiteSection({ data }: { data: SuiteData }) {
  const rows = data.benchmarks
    .map((b) => ({ ...b, ratio: b.vex.median_ms / b.go.median_ms }))
    .sort((a, b) => a.ratio - b.ratio);
  const faster = rows.filter((r) => r.ratio < 1).length;
  const lighter = rows.filter((r) => r.vex.peak_rss_bytes < r.go.peak_rss_bytes).length;
  const sizes = rows.map((r) => r.vex.binary_bytes).sort((a, b) => a - b);
  const goSizes = rows.map((r) => r.go.binary_bytes).sort((a, b) => a - b);
  const typical = (xs: number[]) => xs[Math.floor(xs.length / 2)];
  const best = rows[0];
  const maxLog = Math.max(...rows.map((r) => Math.abs(Math.log2(r.ratio))));

  const stats = [
    ['Faster than Go', `${faster} of ${rows.length}`, 'programs'],
    ['Binary size', formatBytes(typical(sizes)), `vs ${formatBytes(typical(goSizes))} for Go`],
    ['Peak memory', 'Lower', `on ${lighter} of ${rows.length} programs`],
    ['Biggest win', `${(1 / best.ratio).toFixed(2)}×`, best.id],
  ];

  return (
    <section id="suite" className="border-b border-fd-border py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-fd-primary uppercase">Vex vs Go</p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-tight text-fd-foreground">The full suite</h2>
            <p className="mt-2 max-w-2xl text-fd-muted-foreground">
              Twelve programs from the compiler&apos;s own benchmark suite, each run alone. Bars show how much faster or slower Vex is than Go.
            </p>
          </div>
          <p className="text-sm text-fd-muted-foreground">
            Vex faster on{' '}
            <span className="font-mono font-semibold text-fd-foreground">
              {faster} of {rows.length}
            </span>
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([k, v, n]) => (
            <div key={k} className="rounded-xl border border-fd-border bg-fd-card px-5 py-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-fd-muted-foreground uppercase">{k}</p>
              <p className="mt-1.5 font-display text-3xl text-fd-foreground">{v}</p>
              <p className="mt-1 text-sm text-fd-muted-foreground">{n}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-fd-border bg-fd-card text-left text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3 text-right">Vex</th>
                <th className="px-4 py-3 text-right">Go</th>
                <th className="px-4 py-3 text-center">Slower · Faster</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Vex vs Go</th>
                <th className="px-4 py-3 text-right">Memory</th>
                <th className="px-4 py-3 text-right">Binary</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const win = r.ratio < 1;
                const width = Math.max(1.5, (Math.abs(Math.log2(r.ratio)) / maxLog) * 50);
                return (
                  <tr key={r.id} className={`border-b border-fd-border last:border-b-0 ${win ? 'bg-blue-50/70 dark:bg-blue-950/40' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-mono font-medium whitespace-nowrap text-fd-foreground">{r.id}</p>
                      <p className="text-xs whitespace-nowrap text-fd-muted-foreground">{r.title}</p>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-foreground ${win ? 'font-semibold' : ''}`}>{ms(r.vex.median_ms)}</td>
                    <td className="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-muted-foreground">{ms(r.go.median_ms)}</td>
                    <td className="w-full min-w-[220px] px-4 py-3">
                      <div className="relative h-1.5 rounded-sm bg-fd-muted" title={r.detail}>
                        <div
                          className={`absolute top-0 h-full rounded-sm ${win ? 'bg-ocean' : 'bg-slate-400 dark:bg-slate-600'}`}
                          style={win ? { left: '50%', width: `${width}%` } : { right: '50%', width: `${width}%` }}
                        />
                        <div className="absolute -top-1.5 left-1/2 h-4.5 w-px bg-fd-muted-foreground/50" />
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono text-xs whitespace-nowrap tabular-nums ${win ? 'font-medium text-fd-primary' : 'text-fd-muted-foreground'}`}>
                      {win ? `${(1 / r.ratio).toFixed(2)}× faster` : `${r.ratio.toFixed(2)}× slower`}
                    </td>
                    <td className="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-muted-foreground">
                      <span className={r.vex.peak_rss_bytes < r.go.peak_rss_bytes ? 'text-fd-foreground' : ''}>{mb(r.vex.peak_rss_bytes)}</span> / {mb(r.go.peak_rss_bytes)} MB
                    </td>
                    <td className="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-muted-foreground">
                      <span className="text-fd-foreground">{formatBytes(r.vex.binary_bytes)}</span> / {formatBytes(r.go.binary_bytes)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-fd-muted-foreground">
          {data.machine.cpu}, {data.machine.os}, measured {data.date}. {data.method} Vex async tasks run on one thread, so <code>tasks</code> limits Go to one thread too.
          Memory and binary columns show Vex / Go. Every program is in{' '}
          <a className="underline underline-offset-2" href="https://github.com/vex-language/vex-lang/tree/main/bench">
            bench/
          </a>{' '}
          of the vex-lang repository, built with {data.tools.vex} and {data.tools.go}.
        </p>
      </div>
    </section>
  );
}
