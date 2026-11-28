import { Reveal } from './reveal';
import { ArrowLink, Section } from './section';

const pillars = [
  {
    title: 'Small and fast',
    body: 'A hello world builds to about 50 KB and starts in under 2 ms, close to C. There is no virtual machine to start and no runtime to install: the binary is the whole program.',
    link: { label: 'See the benchmarks', href: '/benchmarks' },
  },
  {
    title: 'Compiled ahead of time',
    body: 'The compiler turns Vex into readable, portable C and builds it with a C compiler, which the SDK includes on Windows and Linux. A generational garbage collector built into every program scans objects by their exact layout and gives unused memory back to the system, so there is nothing to free by hand.',
    link: { label: 'How memory works', href: '/docs/internals/memory' },
  },
  {
    title: 'Safe and expressive',
    body: 'Static types with inference, optionals instead of null, exhaustive pattern matching and errors you can see at every call. Familiar to anyone who knows Dart, Swift, Kotlin or Go.',
    link: { label: 'Take the tour', href: '/docs/tour' },
  },
];

/// The three principles behind Vex.
export function Pillars() {
  return (
    <Section eyebrow="Why Vex" title="A modern language that compiles to native code" sub="Familiar syntax and safe types, from the first line of code to a standalone binary.">
      <div className="grid border-t border-fd-border md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="flex flex-col border-b border-fd-border py-8 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0 md:[&+&]:border-l">
            <p className="mb-4 font-mono text-[13px] text-fd-muted-foreground">0{i + 1}</p>
            <h3 className="mb-3 font-display text-2xl text-fd-foreground">{p.title}</h3>
            <p className="mb-6 flex-1 text-[15px] leading-relaxed text-fd-muted-foreground">{p.body}</p>
            <ArrowLink href={p.link.href} className="text-sm">
              {p.link.label}
            </ArrowLink>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
