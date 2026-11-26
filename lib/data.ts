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

/// Counts done and total tasks in a phase.
export function progress(phase: Phase) {
  const tasks = phase.sections.flatMap((s) => s.tasks);
  return { done: tasks.filter((t) => t.status === 'done').length, total: tasks.length };
}
