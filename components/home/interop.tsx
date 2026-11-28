import { Code } from './code';
import { Reveal } from './reveal';
import { Section } from './section';
import { CodeCard, StatusList, type StatusItem } from './status-list';

const c = 'font-mono text-[13px] text-fd-foreground';

const items: StatusItem[] = [
  { title: 'C functions and pointer types', detail: <><code className={c}>extern fn</code> and <code className={c}>extern type</code>, no headers needed</>, status: 'Available' },
  { title: 'Callbacks and exports', detail: <>Vex closures passed to C, <code className={c}>export fn</code> called back from C</>, status: 'Available' },
  { title: 'Objective-C and Apple frameworks', detail: <><code className={c}>.m</code> files and <code className={c}>frameworks</code> in package.toml</>, status: 'Available' },
  { title: 'Structs, C memory and variadic calls', detail: 'Structs by value, buffers without copies, printf-style functions', status: 'Planned' },
  { title: 'Bindings generated from headers', detail: <><code className={c}>vex bind c</code>, then <code className={c}>vex bind ios</code> and <code className={c}>vex bind android</code></>, status: 'Planned' },
];

const sample = `extern type Db as "sqlite3"
extern fn sqlite3_libversion() -> string
extern fn db_open(path: string) -> Db?
extern fn db_rows(db: Db, sql: string, row: fn(string))
extern fn sqlite3_close(db: Db) -> int32

fn main() {
    println("SQLite {sqlite3_libversion()}")
    guard let db = db_open("app.db") else { return }
    defer { sqlite3_close(db) }

    db_rows(db, "select name from users") { name in
        println(name)
    }
}`;

/// Calling C libraries from Vex: what works today and what comes next.
export function Interop() {
  return (
    <Section
      eyebrow="Interop"
      title="Bring any C library"
      sub="Declare a C function and call it. No hand-written headers and no runtime bridge: Vex compiles to C, so a call costs what it costs in C."
      action={{ label: 'Read the C interop guide', href: '/docs/projects/c-interop' }}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal>
          <StatusList items={items} />
          <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground">
            Planned items are V-188 to V-195 on the roadmap. Each new piece of syntax is approved before it is built.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <CodeCard file="users.vx" label="SQLite">
            <Code code={sample} className="px-5 py-4 text-[13px] leading-[23px]" />
          </CodeCard>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            Links with <code className="font-mono text-[13px]">libs = [&quot;sqlite3&quot;]</code> in package.toml, plus a three-line{' '}
            <code className="font-mono text-[13px]">db_open</code> wrapper in C. The row callback is a Vex closure that SQLite calls for every row.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
