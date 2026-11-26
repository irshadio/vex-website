import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/// Fades its content up once, on page load.
export function FadeIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={cn('vx-fade', className)} style={{ '--d': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
