import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './reveal';
import { Section } from './section';

const topics = [
  ['Structs', 'language/structs', 'Fields with defaults, methods and constructors with named arguments.'],
  ['Enums and match', 'language/enums', 'Cases with values, matched exhaustively.'],
  ['Optionals', 'language/optionals', 'Nil safety in the type system, with ?. and ??.'],
  ['Errors', 'language/errors', 'throws, try and catch, visible at every call.'],
  ['Generics', 'language/generics', 'Type parameters for functions, structs, enums and methods.'],
  ['Interfaces', 'language/interfaces', 'Methods and properties a type promises to provide.'],
  ['Closures', 'language/closures', 'Functions as values, with trailing blocks.'],
  ['Async', 'concurrency/async', 'async and await on an event loop, with cancellation and timeouts.'],
  ['Isolates', 'concurrency/isolates', 'Parallel code on other cores, with channels.'],
  ['Extensions', 'language/extensions', 'New methods on existing types, built-in ones included.'],
  ['Modules', 'projects/modules', 'Folders as modules, packages from git repositories.'],
  ['C functions', 'projects/c-interop', 'Call C and export Vex functions to C.'],
];

/// Links to the main topics of the language reference.
export function Glance() {
  return (
    <Section
      eyebrow="The language"
      title="Everything a modern language needs"
      sub="Vex brings the features developers expect from Dart, Swift and Kotlin, with a syntax that stays out of the way."
      action={{ label: 'Language guide', href: '/docs/language' }}
      className="bg-fd-card dark:bg-[#0f172a]"
    >
      <div className="grid overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1 }}>
        {topics.map(([title, page, body], i) => (
          <Reveal key={page} delay={(i % 3) * 0.04} className="bg-fd-background">
            <Link href={`/docs/${page}`} className="group flex h-full flex-col gap-1.5 p-6 transition-colors hover:bg-fd-muted/60">
              <span className="flex items-center justify-between font-semibold text-fd-foreground">
                {title}
                <ArrowUpRight className="size-4 text-fd-muted-foreground transition-colors group-hover:text-ocean" />
              </span>
              <span className="text-sm leading-relaxed text-fd-muted-foreground">{body}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
