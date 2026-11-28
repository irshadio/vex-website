import { Code } from './code';
import { Reveal } from './reveal';
import { Section } from './section';

const platforms = [
  { name: 'macOS', detail: 'Apple silicon and Intel', status: 'Available' },
  { name: 'Linux', detail: 'x64 and ARM64', status: 'Available' },
  { name: 'Windows', detail: 'x64, with no Visual Studio needed', status: 'Available' },
  { name: 'iOS and Android', detail: 'Cross-compiled native code', status: 'Planned' },
];

const sample = `import "vex:fs"
import "vex:os"

fn main() {
    var total = 0
    for path in os.args() {
        let text = try fs.read(path) catch e {
            println("{path}: {e.message}")
            continue
        }
        let count = text.lines().len
        total += count
        println("{count}\\t{path}")
    }
    println("{total}\\ttotal")
}`;

/// Where Vex runs today, with a small portable program.
export function Platforms() {
  return (
    <Section
      eyebrow="Platforms"
      title="One pipeline, every target"
      sub="The compiler emits portable C, so the same source builds a native executable on every supported platform."
      action={{ label: 'See the roadmap', href: '/roadmap' }}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-fd-border">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between gap-4 border-b border-fd-border px-5 py-4 last:border-b-0">
                <div>
                  <p className="font-semibold text-fd-foreground">{p.name}</p>
                  <p className="text-sm text-fd-muted-foreground">{p.detail}</p>
                </div>
                <span
                  className={
                    p.status === 'Available'
                      ? 'rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'rounded-md bg-fd-muted px-2.5 py-1 text-xs font-semibold text-fd-muted-foreground'
                  }
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-code">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-5 py-3">
              <span className="font-mono text-[13px] text-slate-300">lines.vx</span>
              <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">macOS · Linux · Windows</span>
            </div>
            <Code code={sample} className="px-5 py-4 text-[13px] leading-[23px]" />
          </div>
          <p className="mt-3 text-sm text-fd-muted-foreground">
            Counts the lines of the files you pass in. <code className="font-mono text-[13px]">vex build lines.vx</code> turns it into an 86 KB standalone executable.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
