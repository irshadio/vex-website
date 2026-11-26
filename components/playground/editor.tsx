'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { HighlighterCore, ThemedToken } from 'shiki/core';
import vexGrammar from '@/lib/vex/vex.tmLanguage.json';
import vexTheme from '@/lib/vex/theme.json';

let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [vexTheme as never],
      langs: [vexGrammar as never],
      engine: createJavaScriptRegexEngine(),
    });
  })();
  return highlighter;
}

const indent = '    ';

/// A Vex code editor: a plain textarea over highlighted code, with line numbers.
export function Editor({ value, onChange, onRun }: { value: string; onChange: (v: string) => void; onRun: () => void }) {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let live = true;
    void getHighlighter().then((h) => {
      if (live) setTokens(h.codeToTokensBase(value, { lang: 'vex', theme: 'vex-night' }));
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
    <div className="vx-code relative flex min-h-full font-mono text-[13.5px] leading-[23px]">
      <div aria-hidden className="sticky left-0 shrink-0 bg-code py-5 pr-4 pl-5 text-right text-slate-600 select-none">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative grid min-w-0 flex-1 py-5 pr-6">
        <pre aria-hidden className="pointer-events-none col-start-1 row-start-1 whitespace-pre text-[#e2e8f0]">
          {tokens
            ? tokens.map((line, i) => (
                <div key={i}>
                  {line.map((t, j) => (
                    <span key={j} style={{ color: t.color }}>
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
          className="col-start-1 row-start-1 resize-none overflow-hidden bg-transparent whitespace-pre text-transparent caret-sky outline-none selection:bg-sky/30"
        />
      </div>
    </div>
  );
}
