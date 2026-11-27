'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { HighlighterCore, ThemedTokenWithVariants } from 'shiki/core';
import vexGrammar from '@/lib/vex/vex.tmLanguage.json';
import vexTheme from '@/lib/vex/theme.json';
import vexLightTheme from '@/lib/vex/theme-light.json';

let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [vexTheme as never, vexLightTheme as never],
      langs: [vexGrammar as never],
      engine: createJavaScriptRegexEngine(),
    });
  })();
  return highlighter;
}

const indent = '    ';

/// A Vex code editor: a plain textarea over highlighted code, with line numbers, in the light or dark theme.
export function Editor({ value, onChange, onRun }: { value: string; onChange: (v: string) => void; onRun: () => void }) {
  const [tokens, setTokens] = useState<ThemedTokenWithVariants[][] | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let live = true;
    void getHighlighter().then((h) => {
      if (live) setTokens(h.codeToTokensWithThemes(value, { lang: 'vex', themes: { light: 'vex-day', dark: 'vex-night' } }));
    });
    return () => {
      live = false;
    };
  }, [value]);

  // Applies an edit through the browser so undo keeps working, falling back to a direct change.
  function replace(start: number, end: number, text: string, caret: number) {
    const el = area.current!;
    el.setSelectionRange(start, end);
    if (!document.execCommand('insertText', false, text)) {
      onChange(value.slice(0, start) + text + value.slice(end));
    }
    requestAnimationFrame(() => el.setSelectionRange(caret, caret));
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onRun();
    } else if (e.key === 'Tab' && !e.shiftKey && start === end) {
      e.preventDefault();
      replace(start, end, indent, start + indent.length);
    } else if (e.key === 'Enter' && !e.shiftKey && start === end) {
      // Keeps the current line's indentation, and adds a level after an opening brace.
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const current = /^[ \t]*/.exec(value.slice(lineStart, start))![0];
      const extra = value[start - 1] === '{' ? indent : '';
      e.preventDefault();
      const text = '\n' + current + extra;
      replace(start, end, text, start + text.length);
    }
  }

  const lines = value.split('\n').length;
  return (
    <div className="vx-code relative flex min-h-full font-mono text-[16px] leading-[26px] md:text-[13.5px] md:leading-[23px]">
      <div aria-hidden className="sticky left-0 shrink-0 bg-white py-5 pr-4 pl-5 text-right text-slate-400 select-none dark:bg-code dark:text-slate-600">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative grid min-w-0 flex-1 py-5 pr-6">
        <pre aria-hidden className="pointer-events-none col-start-1 row-start-1 whitespace-pre text-slate-900 dark:text-slate-200">
          {tokens
            ? tokens.map((line, i) => (
                <div key={i}>
                  {line.map((t, j) => (
                    <span
                      key={j}
                      className="vx-token"
                      style={{ '--light': t.variants.light.color, '--dark': t.variants.dark.color } as CSSProperties}
                    >
                      {t.content}
                    </span>
                  ))}
                  {line.length === 0 && ' '}
                </div>
              ))
            : value + ' '}
        </pre>
        <textarea
          ref={area}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label="Vex source code"
          className="col-start-1 row-start-1 resize-none overflow-hidden bg-transparent whitespace-pre text-transparent caret-ocean outline-none selection:bg-ocean/20 dark:caret-sky dark:selection:bg-sky/30"
        />
      </div>
    </div>
  );
}
