import fs from 'node:fs';
import path from 'node:path';

/// One task on the roadmap.
export interface Task {
  id: string;
  text: string;
  status: 'done' | 'active' | 'todo';
  size: string | null;
}

/// One phase of the roadmap.
export interface Phase {
  number: number;
  title: string;
  version: string | null;
  goal: string | null;
  sections: { title: string | null; tasks: Task[] }[];
}

/// Benchmark results written by `npm run bench`.
export interface BenchmarkData {
  date: string;
  machine: { cpu: string; cores: number; memory: string; os: string };
  method: string;
  languages: { id: string; name: string; kind: string; note: string | null; version: string | null }[];
  benchmarks: { id: string; title: string; detail: string }[];
  results: { benchmark: string; language: string; mean: number; min: number; stddev: number; runs: number; memory: number; size: number | null }[];
}

/// One side of a suite result: Vex or Go.
export interface SuiteSide {
  median_ms: number;
  min_ms: number;
  stddev_ms: number;
  binary_bytes: number;
  peak_rss_bytes: number;
}

/// Vex and Go results for the compiler's benchmark suite, written by `npm run bench:suite`.
export interface SuiteData {
  date: string;
  machine: { cpu: string; cores: number; memory_bytes: number; os: string };
  method: string;
  tools: { vex: string; go: string; c_compiler: string };
  benchmarks: { id: string; title: string; detail: string; checksum: string; vex: SuiteSide; go: SuiteSide }[];
}

const generated = path.join(process.cwd(), 'lib', 'generated');

function readJson<T>(name: string): T | null {
  const file = path.join(generated, name);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as T) : null;
}

/// Returns the roadmap phases synced from the backlog.
export function getRoadmap(): Phase[] {
  return readJson<Phase[]>('roadmap.json') ?? [];
}

/// Returns the benchmark results, or null before the first run.
export function getBenchmarks(): BenchmarkData | null {
  return readJson<BenchmarkData>('benchmarks.json');
}

/// Returns the Vex and Go suite results, or null before the first run.
export function getSuite(): SuiteData | null {
  return readJson<SuiteData>('suite.json');
}

/// Counts done and total tasks in a phase.
export function progress(phase: Phase) {
  const tasks = phase.sections.flatMap((s) => s.tasks);
  return { done: tasks.filter((t) => t.status === 'done').length, total: tasks.length };
}
