import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { codeToHtml } from 'shiki';
import { getBenchmarks } from '@/lib/data';
import { formatBytes, formatTime } from '@/lib/format';
import { highlight } from '@/lib/highlight';
import vexTheme from '@/lib/vex/theme.json';
import { PageHeader } from '@/components/pages/page-header';
import { SourceTabs } from '@/components/pages/source-tabs';
import { Footer } from '@/components/home/footer';

export const metadata: Metadata = {
  title: 'Benchmarks',
  description: 'Vex compared with C, Rust, Go, Swift, Dart, Kotlin and JavaScript on the same programs.',
};

const sources: Record<string, { file: string; lang: string }> = {
  vex: { file: 'main.vx', lang: 'vex' },
  c: { file: 'main.c', lang: 'c' },
  rust: { file: 'main.rs', lang: 'rust' },
  go: { file: 'main.go', lang: 'go' },
  swift: { file: 'main.swift', lang: 'swift' },
  dart: { file: 'main.dart', lang: 'dart' },
  kotlin: { file: 'Main.kt', lang: 'kotlin' },
  node: { file: 'main.js', lang: 'javascript' },
};


export default async function BenchmarksPage() {
  const data = getBenchmarks();
  if (!data) {
    return (
      <PageHeader eyebrow="Performance" title="Benchmarks">
        Results will appear here after the first benchmark run.
      </PageHeader>
    );
  }
  const name = (id: string) => data.languages.find((l) => l.id === id)!;

  const sections = await Promise.all(
    data.benchmarks.map(async (b) => {
      const rows = data.results.filter((r) => r.benchmark === b.id).sort((x, y) => x.mean - y.mean);
      const vex = rows.find((r) => r.language === 'vex');
      const files = await Promise.all(
        [...rows].sort((x, y) => Number(y.language === 'vex') - Number(x.language === 'vex')).map(async (r) => {
          const src = sources[r.language];
          const code = fs.readFileSync(path.join(process.cwd(), 'benchmarks', b.id, src.file), 'utf8');
          const html = src.lang === 'vex' ? await highlight(code) : await codeToHtml(code, { lang: src.lang, theme: vexTheme as never });
          return { id: r.language, label: name(r.language).name, file: src.file, html };
        }),
      );
      return { b, rows, vex, files, max: Math.max(...rows.map((r) => r.mean)) };
    }),
  );

  return (
    <>
      <main>
        <PageHeader eyebrow="Performance" title="Benchmarks">
          The same programs, written idiomatically in each language and checked to print the same result. Every program and
          the script that runs them are published below, so the numbers can be reproduced.
        </PageHeader>

        <section className="border-b border-fd-border">
          <div className="mx-auto grid max-w-6xl gap-px px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
            {[
              ['Machine', data.machine.cpu],
              ['System', `${data.machine.os}, ${data.machine.memory} memory`],
              ['Measured', data.date],
              ['Runs', '10 timed runs after 2 warm-ups'],
            ].map(([k, v]) => (
              <div key={k} className="py-2 lg:pr-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-fd-muted-foreground uppercase">{k}</p>
                <p className="mt-1 font-medium text-fd-foreground">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {sections.map(({ b, rows, vex, files, max }) => (
          <section key={b.id} id={b.id} className="border-b border-fd-border py-16">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-light tracking-tight text-fd-foreground">{b.title}</h2>
                  <p className="mt-2 text-fd-muted-foreground">{b.detail}</p>
                </div>
                {vex && (
                  <p className="text-sm text-fd-muted-foreground">
                    Vex: <span className="font-mono font-semibold text-fd-foreground">{formatTime(vex.mean)}</span>, rank{' '}
                    {rows.indexOf(vex) + 1} of {rows.length}
                  </p>
                )}
              </div>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="overflow-x-auto rounded-xl border border-fd-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-fd-border bg-fd-card text-left text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                        <th className="px-4 py-3">Language</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3 text-right">Memory</th>
                        <th className="px-4 py-3 text-right">Binary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const l = name(r.language);
                        const isVex = r.language === 'vex';
                        return (
                          <tr key={r.language} className={`border-b border-fd-border last:border-b-0 ${isVex ? 'bg-blue-50/70 dark:bg-blue-950/40' : ''}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={isVex ? 'font-semibold text-fd-foreground' : 'text-fd-foreground'}>{l.name}</span>
                              {l.note && <span className="ml-1.5 text-xs text-fd-muted-foreground">{l.note}</span>}
                            </td>
                            <td className="w-full px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 rounded-sm bg-fd-muted">
                                  <div className={`h-full rounded-sm ${isVex ? 'bg-ocean' : 'bg-slate-400 dark:bg-slate-600'}`} style={{ width: `${Math.max(1, (r.mean / max) * 100)}%` }} />
                                </div>
                                <span className="w-16 text-right font-mono tabular-nums">{formatTime(r.mean)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-muted-foreground">{formatBytes(r.memory)}</td>
                            <td className="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums text-fd-muted-foreground">{r.size ? formatBytes(r.size) : 'n/a'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <SourceTabs files={files} />
              </div>
            </div>
          </section>
        ))}

        <section className="py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 font-display text-2xl text-fd-foreground">Method</h2>
              <p className="leading-relaxed text-fd-muted-foreground">{data.method}</p>
              <p className="mt-4 leading-relaxed text-fd-muted-foreground">
                Compiled languages use release settings: <code>clang -O2</code>, <code>rustc -C opt-level=3</code>, <code>swiftc -O</code>,{' '}
                <code>dart compile exe</code> and the default <code>go build</code>. Vex builds with its default settings, which compile the generated C
                with <code>-O2</code>. Kotlin runs on the desktop JVM, not Android's ART runtime, and its times include JVM start-up, as a user would see it. Binary size is the size of the
                executable; it is not applicable to languages that need a separate runtime.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-fd-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fd-border bg-fd-card text-left text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3">Toolchain</th>
                  </tr>
                </thead>
                <tbody>
                  {data.languages.map((l) => (
                    <tr key={l.id} className="border-b border-fd-border last:border-b-0">
                      <td className="px-4 py-2.5 font-medium whitespace-nowrap text-fd-foreground">{l.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{l.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
