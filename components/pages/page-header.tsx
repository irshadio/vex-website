import type { ReactNode } from 'react';

/// The title block at the top of a standalone page.
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="border-b border-fd-border">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:px-6 md:pt-20">
        <p className="mb-3 text-[13px] font-semibold tracking-[0.12em] text-ocean uppercase dark:text-blue-400">{eyebrow}</p>
        <h1 className="font-display text-4xl font-light tracking-tight text-fd-foreground md:text-6xl">{title}</h1>
        {children && <div className="mt-5 max-w-3xl text-[17px] leading-relaxed text-fd-muted-foreground">{children}</div>}
      </div>
    </header>
  );
}

/// Renders `code` spans written with backticks in plain text.
export function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') ? (
          <code key={i} className="rounded bg-fd-muted px-1 py-px font-mono text-[0.85em] text-fd-foreground">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
