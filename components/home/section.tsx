import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './reveal';

/// A page section with an eyebrow, title, optional subtitle and an optional link on the right.
export function Section({
  id,
  eyebrow,
  title,
  sub,
  action,
  className,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  action?: { label: string; href: string };
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn('border-b border-fd-border py-20 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-[13px] font-semibold tracking-[0.12em] text-ocean uppercase dark:text-blue-400">{eyebrow}</p>
            <h2 className="font-display text-3xl font-light tracking-tight text-fd-foreground md:text-[42px] md:leading-[1.15]">{title}</h2>
            {sub && <p className="mt-4 text-[17px] leading-relaxed text-fd-muted-foreground">{sub}</p>}
          </div>
          {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/// A text link with a trailing arrow.
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ocean dark:text-blue-400', className)}>
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
