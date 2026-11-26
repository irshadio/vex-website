'use client';
import dynamic from 'next/dynamic';

/// The playground, rendered only in the browser because it opens programs from the address.
export const PlaygroundClient = dynamic(() => import('./playground').then((m) => m.Playground), {
  ssr: false,
  loading: () => <div className="h-[calc(100dvh-3.5rem)] min-h-[560px] bg-white dark:bg-code" />,
});
