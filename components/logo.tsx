import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

/// The Vex mark: two arms meeting in a deep blue overlap.
export function Mark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 116 100" fill="none" aria-hidden="true" className={cn('h-6 w-auto', className)} style={style}>
      <path d="M0 0H34.5238L70.4286 99.4286H45.5714L0 0Z" fill="#2563EB" />
      <path d="M116 0H81.4763L45.5715 99.4286H70.4287L116 0Z" fill="#38BDF8" />
      <path d="M58.0001 65.043L70.4287 99.4287H45.5715L58.0001 65.043Z" fill="#1E3A8A" />
    </svg>
  );
}

/// The primary lockup from the brand guide, with the dark variant on dark backgrounds.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-[22px] items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/vex-lockup-light.svg" alt="Vex" width={98} height={22} className="h-full w-auto dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/vex-lockup-dark.svg" alt="Vex" width={98} height={22} className="hidden h-full w-auto dark:block" />
    </span>
  );
}
