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

/// The result of running a program on the run service: its terminal session and exit status.
export interface RunResult {
  session: SessionEvent[];
  exitCode: number;
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

/// Runs [source] on the run service, which types each of [input]'s lines once the program waits for it.
export async function runRemote(source: string, input: string[]): Promise<RunResult> {
  const res = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, input }),
  });
  if (!res.ok) throw new Error(`the run service answered ${res.status}`);
  return (await res.json()) as RunResult;
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
