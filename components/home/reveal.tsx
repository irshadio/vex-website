import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/// Fades its content up as it scrolls into view, where the browser supports scroll-driven animations.
export function Reveal({ children, className }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={cn('vx-reveal', className)}>{children}</div>;
}
