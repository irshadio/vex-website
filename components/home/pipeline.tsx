import { Reveal } from './reveal';
import { ArrowLink, Section } from './section';

const steps = [
  ['Source', 'main.vx'],
  ['Lexer', 'Tokens'],
  ['Parser', 'Syntax tree'],
  ['Type checker', 'Typed program'],
  ['Code generator', 'Portable C'],
  ['C compiler', 'clang or gcc'],
  ['Output', 'Native binary'],
];

/// The stages of the compiler.
export function Pipeline() {
  return (
    <Section eyebrow="How it works" title="A simple, transparent compiler" sub="Written in Go, the compiler checks your program and emits readable C. Run vex emit-c to see exactly what it produces.">
      <Reveal>
        <ol className="grid overflow-hidden rounded-xl border border-fd-border sm:grid-cols-4 lg:grid-cols-7">
          {steps.map(([title, out], i) => (
            <li key={title} className={`border-fd-border p-5 ${i ? 'border-t sm:border-t-0 sm:border-l' : ''} ${i === steps.length - 1 ? 'bg-ocean text-white' : ''}`}>
              <p className={`mb-1 font-mono text-xs ${i === steps.length - 1 ? 'text-blue-100' : 'text-fd-muted-foreground'}`}>{String(i + 1).padStart(2, '0')}</p>
              <p className="font-semibold">{title}</p>
              <p className={`text-sm ${i === steps.length - 1 ? 'text-blue-100' : 'text-fd-muted-foreground'}`}>{out}</p>
            </li>
          ))}
        </ol>
      </Reveal>
      <div className="mt-6">
        <ArrowLink href="/docs/install" className="text-sm">
          Install the compiler
        </ArrowLink>
      </div>
    </Section>
  );
}
