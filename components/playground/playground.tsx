'use client';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Link2, LoaderCircle, Play, RotateCcw } from 'lucide-react';
import { InlineCode } from '@/components/pages/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import {
  decodeSource,
  encodeSource,
  loadCompiler,
  runRemote,
  runUrl,
  type CheckResult,
  type PlaygroundExample,
  type SessionEvent,
} from '@/lib/playground';
import { Editor } from './editor';

type Panel = 'output' | 'problems';

/// What the terminal shows: a finished session, or a program waiting for the input it reads.
type Terminal =
  | { kind: 'idle' }
  | { kind: 'session'; events: SessionEvent[]; error: boolean; note: string | null }
  | { kind: 'input'; lines: string[] };

// A call to input() in the source, so the program reads from the keyboard.
const readsInput = (src: string) => /\binput\s*\(/.test(src);

/// Returns the program to open: a shared one from the address, an example named in it, or the first example.
function startingPoint(examples: PlaygroundExample[]) {
  const code = new URLSearchParams(window.location.hash.slice(1)).get('code');
  const shared = code ? decodeSource(code) : null;
  if (shared) return { exampleId: '', source: shared };
  const id = new URLSearchParams(window.location.search).get('example');
  const e = examples.find((x) => x.id === id) ?? examples[0];
  return { exampleId: e.id, source: e.code };
}

/// The Vex playground: edit a program, check it as you type, and run it.
export function Playground({ examples }: { examples: PlaygroundExample[] }) {
  const [initial] = useState(() => startingPoint(examples));
  const [exampleId, setExampleId] = useState(initial.exampleId);
  const example = examples.find((e) => e.id === exampleId) ?? null;
  const [source, setSource] = useState(initial.source);
  const [panel, setPanel] = useState<Panel>('output');
  const [compiler, setCompiler] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [version, setVersion] = useState('');
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [terminal, setTerminal] = useState<Terminal>({ kind: 'idle' });
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    loadCompiler().then(
      (v) => {
        setVersion(v.version);
        setCompiler('ready');
      },
      () => setCompiler('failed'),
    );
  }, []);

  // Checks the program shortly after each edit.
  useEffect(() => {
    if (compiler !== 'ready') return;
    const t = setTimeout(() => void loadCompiler().then((v) => setCheck(v.check(source))), 250);
    return () => clearTimeout(t);
  }, [source, compiler]);

  const problems = check && !check.ok ? (check.messages.match(/^error: /gm)?.length ?? 1) : 0;

  function openExample(id: string) {
    const e = examples.find((x) => x.id === id);
    if (!e) return;
    setExampleId(id);
    setSource(e.code);
    setTerminal({ kind: 'idle' });
    setPanel('output');
    history.replaceState(null, '', `?example=${id}`);
  }

  // Sends the program to the run service with the lines typed for it.
  const runOnService = useCallback(
    async (lines: string[]) => {
      setRunning(true);
      try {
        const res = await runRemote(source, lines);
        setTerminal({ kind: 'session', events: res.session, error: false, note: res.exitCode ? `Exited with status ${res.exitCode}` : null });
      } catch (err) {
        setTerminal({ kind: 'session', events: [{ out: err instanceof Error ? err.message : String(err) }], error: true, note: null });
      } finally {
        setRunning(false);
      }
    },
    [source],
  );

  const run = useCallback(async () => {
    setPanel('output');
    if (terminal.kind === 'input') return runOnService(terminal.lines);
    const v = await loadCompiler();
    const r = v.check(source);
    setCheck(r);
    if (!r.ok) {
      setTerminal({ kind: 'session', events: [{ out: r.messages }], error: true, note: null });
    } else if (example && source === example.code) {
      setTerminal({ kind: 'session', events: example.session, error: false, note: 'Recorded when this example was verified.' });
    } else if (runUrl && readsInput(source)) {
      setTerminal({ kind: 'input', lines: [] });
    } else if (runUrl) {
      await runOnService([]);
    } else {
      setTerminal({
        kind: 'session',
        events: [],
        error: false,
        note: 'No errors. Running edited programs in the browser is coming; until then, save the code as main.vx and run vex run main.vx.',
      });
    }
  }, [source, example, terminal, runOnService]);

  function reset() {
    if (example) setSource(example.code);
    setTerminal({ kind: 'idle' });
  }

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}#code=${encodeSource(source)}`;
    history.replaceState(null, '', url);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const tabs: { id: Panel; label: string }[] = [
    { id: 'output', label: 'Output' },
    { id: 'problems', label: problems ? `Problems (${problems})` : 'Problems' },
  ];

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-[560px] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-fd-border px-4 py-2.5 md:px-6">
        <label className="relative">
          <span className="sr-only">Example</span>
          <select
            value={exampleId}
            onChange={(e) => openExample(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-fd-border bg-fd-background pr-9 pl-3 text-sm font-medium text-fd-foreground"
          >
            {!exampleId && <option value="">Shared program</option>}
            {examples.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-2.5 right-3 size-4 text-fd-muted-foreground" />
        </label>
        {example?.note && (
          <p className="hidden truncate text-sm text-fd-muted-foreground lg:block">
            <InlineCode text={example.note} />
          </p>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-fd-muted-foreground sm:inline">
            {compiler === 'loading' ? 'Loading compiler…' : compiler === 'failed' ? 'The compiler failed to load' : `vex ${version}`}
          </span>
          <Button variant="ghost" size="sm" onClick={reset} disabled={!example} title="Reset to the example">
            <RotateCcw /> <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="outline" size="sm" onClick={share} title="Copy a link to this program">
            {copied ? <Check /> : <Link2 />} <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </Button>
          <Button size="sm" onClick={run} disabled={running || compiler !== 'ready'} title="Run (Ctrl or Cmd + Enter)">
            {running ? <LoaderCircle className="animate-spin" /> : <Play />} Run
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-1">
        <div className="min-h-0 overflow-auto bg-code [font-variant-ligatures:none]">
          <Editor value={source} onChange={setSource} onRun={run} />
        </div>

        <div className="flex min-h-0 flex-col border-t border-slate-800 bg-term lg:border-t-0 lg:border-l">
          <div role="tablist" aria-label="Results" className="flex shrink-0 border-b border-slate-800 bg-[#0f172a] px-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={panel === t.id}
                onClick={() => setPanel(t.id)}
                className={cn(
                  'relative px-4 py-3 text-[13px] font-medium transition-colors',
                  panel === t.id ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                  t.id === 'problems' && problems > 0 && panel !== t.id && 'text-rose-300',
                )}
              >
                {t.label}
                {panel === t.id && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-sky" />}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-6 py-5 font-mono text-[13px] leading-[23px] [font-variant-ligatures:none]">
            {panel === 'output' ? (
              <TerminalView terminal={terminal} onInput={(lines) => setTerminal({ kind: 'input', lines })} onRun={run} />
            ) : check && !check.ok ? (
              <pre className="whitespace-pre-wrap text-rose-300">{check.messages}</pre>
            ) : (
              <p className="font-sans text-sm text-slate-500">{check ? 'No problems.' : 'Checking…'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/// The output panel, drawn as a terminal: the command, what the program printed, and the lines typed at its prompts.
function TerminalView({ terminal, onInput, onRun }: { terminal: Terminal; onInput: (lines: string[]) => void; onRun: () => void }) {
  if (terminal.kind === 'idle') {
    return <p className="font-sans text-sm text-slate-500">Press Run, or Ctrl + Enter, to see what the program prints.</p>;
  }
  return (
    <>
      <p className="text-slate-500">$ vex run main.vx</p>
      {terminal.kind === 'session' ? (
        <>
          <pre className={cn('whitespace-pre-wrap', terminal.error ? 'text-rose-300' : 'text-slate-300')}>
            {terminal.events.map((e, i) =>
              'in' in e ? (
                <span key={i} className="text-sky">
                  {e.in + '\n'}
                </span>
              ) : 'err' in e ? (
                <span key={i} className="text-rose-300">
                  {e.err}
                </span>
              ) : (
                <span key={i}>{e.out}</span>
              ),
            )}
          </pre>
          {terminal.note && <p className="mt-3 font-sans text-xs text-slate-500">{terminal.note}</p>}
        </>
      ) : (
        <InputLines lines={terminal.lines} onChange={onInput} onRun={onRun} />
      )}
    </>
  );
}

/// Collects the lines a program reads with input(), typed in the terminal, before it runs.
function InputLines({ lines, onChange, onRun }: { lines: string[]; onChange: (lines: string[]) => void; onRun: () => void }) {
  const [line, setLine] = useState('');
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onChange(line ? [...lines, line] : lines);
      setLine('');
      onRun();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onChange([...lines, line]);
      setLine('');
    } else if (e.key === 'Backspace' && !line && lines.length) {
      e.preventDefault();
      setLine(lines.at(-1)!);
      onChange(lines.slice(0, -1));
    }
  }
  return (
    <>
      <p className="mb-2 font-sans text-xs text-slate-500">
        This program reads from the keyboard. Type each line it asks for and press Enter, then press Ctrl + Enter to run it.
      </p>
      {lines.map((l, i) => (
        <p key={i} className="whitespace-pre text-sky">
          {l || ' '}
        </p>
      ))}
      <input
        autoFocus
        value={line}
        onChange={(e) => setLine(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Input line"
        spellCheck={false}
        className="w-full bg-transparent text-sky caret-sky outline-none"
      />
    </>
  );
}
