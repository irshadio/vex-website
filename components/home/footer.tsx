import Link from 'next/link';
import { Logo } from '@/components/logo';

const columns = [
  { title: 'Learn', links: [['Get started', '/docs'], ['Install', '/docs/install'], ['Language tour', '/docs/tour'], ['Examples', '/docs/examples']] },
  { title: 'Reference', links: [['Language guide', '/docs/language'], ['Standard library', '/docs/stdlib'], ['The vex command', '/docs/tools/cli'], ['Compile errors', '/docs/tools/compile-errors']] },
  { title: 'Project', links: [['Roadmap', '/roadmap'], ['Benchmarks', '/benchmarks'], ['Design notes', '/docs/internals/compiler']] },
];

/// The site footer.
export function Footer() {
  return (
    <footer className="border-t border-fd-border bg-fd-background">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground">A compiled, statically typed, general-purpose programming language.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 className="mb-4 text-sm font-semibold text-fd-foreground">{c.title}</h4>
                <ul className="grid gap-2.5">
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-fd-border pt-6 text-[13px] text-fd-muted-foreground">
          <span>© 2026 The Vex authors. Licensed under MIT or Apache 2.0.</span>
          <span>Vex 0.1 · Early development</span>
        </div>
      </div>
    </footer>
  );
}
