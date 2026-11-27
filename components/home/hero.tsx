import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { highlight } from '@/lib/highlight';
import { FadeIn } from './fade-in';
import { CodeTabs } from './code-tabs';
import { samples } from './samples';

const facts = [
  { value: 'Native', label: 'Compiled ahead of time to machine code' },
  { value: 'Typed', label: 'Static types with inference' },
  { value: 'Open', label: 'MIT or Apache 2.0 licensed' },
];

/// The first section: headline, actions and runnable code samples.
export async function Hero() {
  const tabs = await Promise.all(samples.map(async (s) => ({ ...s, html: await highlight(s.code) })));
  return (
    <section className="border-b border-fd-border">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="flex min-w-0 flex-col items-start">
          <FadeIn>
            <p className="mb-6 flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
              <span className="size-1.5 rounded-full bg-ocean" />
              Version 0.1 · Early development
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="font-display text-5xl leading-[1.05] font-light tracking-[-0.03em] text-fd-foreground sm:text-6xl lg:text-7xl">
              Readable code.
              <br />
              <span className="text-ocean dark:text-blue-400">Native speed.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fd-muted-foreground">
              Vex is a compiled, statically typed, general-purpose programming language. Familiar syntax, safe types and
              small native binaries, with no virtual machine in between.
            </p>
          </FadeIn>
          <FadeIn delay={0.24} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/docs/install">
                Install Vex <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs/tour">Take the tour</Link>
            </Button>
          </FadeIn>
          <FadeIn delay={0.32} className="mt-12 grid w-full grid-cols-[repeat(3,minmax(0,1fr))] border-t border-fd-border pt-6">
            {facts.map((f, i) => (
              <div key={f.value} className={i ? 'border-l border-fd-border pl-3 sm:pl-6' : 'pr-3 sm:pr-4'}>
                <p className="font-display text-xl text-fd-foreground">{f.value}</p>
                <p className="mt-1 text-[13px] leading-snug text-fd-muted-foreground">{f.label}</p>
              </div>
            ))}
          </FadeIn>
        </div>
        <FadeIn delay={0.2} className="min-w-0">
          <CodeTabs tabs={tabs} />
        </FadeIn>
      </div>
    </section>
  );
}
