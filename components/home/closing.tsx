import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './reveal';

/// The closing call to action.
export function Closing() {
  return (
    <section className="bg-night text-white">
      <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-4 py-20 md:px-6">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-light tracking-tight md:text-[42px] md:leading-[1.15]">Start building with Vex</h2>
          <p className="mt-3 text-[17px] text-slate-400">Install the compiler and run your first program in a few minutes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/docs/install">
              Install Vex <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
