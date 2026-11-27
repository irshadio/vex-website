/// One step of a terminal session: text the program printed to standard output or standard error, or a line typed
/// at its prompt.
export type SessionEvent = { out: string } | { err: string } | { in: string };

/// One example program offered in the playground, with the session recorded when it was verified.
export interface PlaygroundExample {
  id: string;
  title: string;
  note: string;
  code: string;
  session: SessionEvent[];
}

/// The result of checking a program with the in-browser compiler.
export interface CheckResult {
  ok: boolean;
  messages: string;
}

interface Compiler {
  version: string;
  check(src: string): CheckResult;
}

declare global {
  interface Window {
    Go?: new () => { importObject: WebAssembly.Imports; run(instance: WebAssembly.Instance): Promise<void> };
    vex?: Compiler;
  }
}

/// The run service's address, set at build time. Without it, programs are checked but not run.
export const runUrl = process.env.NEXT_PUBLIC_VEX_RUN_URL ?? '';

let loading: Promise<Compiler> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`couldn't load ${src}`));
    document.head.append(el);
  });
}

/// Loads the Vex compiler, built to WebAssembly, once per page.
export function loadCompiler(): Promise<Compiler> {
  loading ??= (async () => {
    if (!window.Go) await loadScript('/playground/wasm_exec.js');
    const go = new window.Go!();
    const res = await fetch('/playground/vex.wasm');
    const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), go.importObject);
    void go.run(instance);
    if (!window.vex) throw new Error('the compiler did not start');
    return window.vex;
  })();
  loading.catch(() => (loading = null));
  return loading;
}

/// Runs [source] on the run service and streams its session: [onEvent] gets each piece of output and each typed
/// line as it happens. Lines typed with [sendInput] go to the program while it runs. Aborting [signal] stops it.
/// Resolves to the exit status.
export async function runLive(
  source: string,
  signal: AbortSignal,
  onStart: (session: string) => void,
  onEvent: (event: SessionEvent) => void,
): Promise<number> {
  const res = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, interactive: true }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error((await res.text()).trim() || `the run service answered ${res.status}`);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) throw new Error('the run service closed the connection');
    buf += value;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const msg = JSON.parse(buf.slice(0, i)) as SessionEvent | { session: string } | { exit: number };
      buf = buf.slice(i + 1);
      if ('exit' in msg) return msg.exit;
      if ('session' in msg) onStart(msg.session);
      else onEvent(msg);
    }
  }
}

/// Types [line] into the running program [session], or ends its input when [line] is null.
export async function sendInput(session: string, line: string | null) {
  const inputUrl = runUrl.replace(/\/run$/, '/input');
  await fetch(inputUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(line === null ? { session, eof: true } : { session, line }),
  });
}

/// Encodes [source] for a share link.
export function encodeSource(source: string) {
  const bytes = new TextEncoder().encode(source);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/// Decodes a share link's source, or returns null when it is malformed.
export function decodeSource(encoded: string) {
  try {
    const bin = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}
