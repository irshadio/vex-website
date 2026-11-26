// Builds and times every benchmark in every language, then writes
// lib/generated/benchmarks.json. Run with `npm run bench`.
// Needs hyperfine and each language's toolchain on PATH.
// VEX points at the vex binary (default: ../../VEX/bin/vex).
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const root = path.resolve(here, '..');
const vex = process.env.VEX ?? path.resolve(root, '..', '..', 'VEX', 'bin', 'vex');
const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'java') : 'java';

const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
const tryVersion = (cmd) => {
  try {
    return sh(`${cmd} 2>&1`).split('\n')[0];
  } catch {
    return null;
  }
};

/// Each language: how to build a benchmark folder and the command that runs it.
const languages = [
  { id: 'vex', name: 'Vex', kind: 'native', version: () => tryVersion(`${vex} version`), build: (d) => sh(`${vex} build main.vx -o build/vex`, d), run: 'build/vex', binary: 'build/vex' },
  { id: 'c', name: 'C', kind: 'native', version: () => tryVersion('clang --version'), build: (d) => sh('clang -O2 main.c -o build/c', d), run: 'build/c', binary: 'build/c' },
  { id: 'rust', name: 'Rust', kind: 'native', version: () => tryVersion('rustc --version'), build: (d) => sh('rustc -C opt-level=3 main.rs -o build/rust', d), run: 'build/rust', binary: 'build/rust' },
  { id: 'go', name: 'Go', kind: 'native', version: () => tryVersion('go version'), build: (d) => sh('go build -o build/go main.go', d), run: 'build/go', binary: 'build/go' },
  { id: 'swift', name: 'Swift', kind: 'native', version: () => tryVersion('swiftc --version'), build: (d) => sh('swiftc -O main.swift -o build/swift', d), run: 'build/swift', binary: 'build/swift' },
  { id: 'dart', name: 'Dart', kind: 'native', note: 'AOT', version: () => tryVersion('dart --version'), build: (d) => sh('dart compile exe main.dart -o build/dart', d), run: 'build/dart', binary: 'build/dart' },
  { id: 'kotlin', name: 'Kotlin', kind: 'jvm', note: 'JVM', version: () => tryVersion('kotlinc -version'), build: (d) => sh('kotlinc Main.kt -include-runtime -d build/kotlin.jar 2>/dev/null', d), run: `${java} -jar build/kotlin.jar` },
  { id: 'node', name: 'JavaScript', kind: 'jit', note: 'Node.js', version: () => tryVersion('node --version'), build: () => {}, run: 'node main.js' },
];

const benchmarks = [
  { id: 'fib', title: 'Recursive calls', detail: 'fib(38), about 126 million function calls', expect: '39088169' },
  { id: 'sieve', title: 'Loops and arrays', detail: 'Sieve of Eratosthenes over 20 million booleans', expect: '1270607' },
  { id: 'trees', title: 'Allocation and GC', detail: 'Binary trees, depth 18, about 67 million short-lived objects', expect: '67283631' },
  { id: 'hello', title: 'Start-up', detail: 'Print "Hello, world!" and exit', expect: 'Hello, world!' },
];

/// Reads a hyperfine export: the per-run measurements of schema 2, or the summary of schema 1.
function readHyperfine(file) {
  const r = JSON.parse(fs.readFileSync(file, 'utf8')).results[0];
  if (!r.measurements) return { timing: { mean: r.mean, min: r.min, stddev: r.stddev ?? 0 }, rss: Math.max(...(r.memory_usage_byte ?? [0])) };
  const times = r.measurements.map((m) => m.time_wall_clock.value);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const stddev = Math.sqrt(times.reduce((a, t) => a + (t - mean) ** 2, 0) / Math.max(1, times.length - 1));
  const rss = Math.max(...r.measurements.map((m) => m.memory_peak_resident?.value ?? 0));
  return { timing: { mean, min: Math.min(...times), stddev }, rss };
}

const only = process.argv.slice(2);
const results = [];

for (const b of benchmarks) {
  const dir = path.join(here, b.id);
  fs.rmSync(path.join(dir, 'build'), { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'build'));
  for (const lang of languages) {
    if (only.length && !only.includes(lang.id)) continue;
    process.stdout.write(`${b.id} / ${lang.name}: `);
    try {
      lang.build(dir);
      const out = sh(lang.run, dir);
      if (out !== b.expect) throw new Error(`printed ${out}, expected ${b.expect}`);
      const runs = 20;
      const json = path.join(dir, 'build', `${lang.id}.json`);
      execFileSync('hyperfine', ['--warmup', '2', '--runs', String(runs), '--export-json', json, '-N', lang.run], { cwd: dir, stdio: 'ignore' });
      const { timing, rss } = readHyperfine(json);
      const size = lang.binary ? fs.statSync(path.join(dir, lang.binary)).size : null;
      results.push({ benchmark: b.id, language: lang.id, mean: timing.mean, min: timing.min, stddev: timing.stddev, runs, memory: rss, size });
      console.log(`${timing.mean.toFixed(3)} s, ${(rss / 1048576).toFixed(1)} MB`);
    } catch (e) {
      console.log(`skipped (${String(e.message).split('\n')[0]})`);
    }
  }
}

const cpu = tryVersion('sysctl -n machdep.cpu.brand_string');
const data = {
  date: new Date().toISOString().slice(0, 10),
  machine: { cpu, cores: os.cpus().length, memory: `${Math.round(os.totalmem() / 1073741824)} GB`, os: `macOS ${tryVersion('sw_vers -productVersion')}` },
  method: 'Mean wall-clock time of 20 runs after 2 warm-up runs, measured with hyperfine. Peak memory is the largest resident set size across the timed runs. Every program prints the same result, which is checked before timing.',
  languages: languages
    .filter((l) => results.some((r) => r.language === l.id))
    .map((l) => ({ id: l.id, name: l.name, kind: l.kind, note: l.note ?? null, version: l.version() })),
  benchmarks: benchmarks.map(({ expect, ...b }) => b),
  results,
};
fs.mkdirSync(path.join(root, 'lib', 'generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'lib', 'generated', 'benchmarks.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote lib/generated/benchmarks.json');
