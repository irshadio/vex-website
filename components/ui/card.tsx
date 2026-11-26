import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/// A bordered surface for grouped content.
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-2xl border border-fd-border bg-fd-background shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:bg-fd-card', className)}
      {...props}
    />
  );
}
