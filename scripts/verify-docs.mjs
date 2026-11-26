// Runs every complete Vex program in the documentation and checks that it prints the Output block shown under it.
// Run with `npm run verify-docs` after the language changes. VEX points at the vex binary (default: bin/vex in the vex-lang checkout).
// Programs that import local folders or call C functions need files the page doesn't show, so they are skipped.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { langDir } from './lang-dir.mjs';

const root = path.resolve(import.meta.dirname, '..');
const docs = path.join(root, 'content', 'docs');
const vex = process.env.VEX ?? path.join(langDir(root), 'bin', 'vex');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'vex-verify-'));

const fence = /^```(\w+)([^\n]*)\n([\s\S]*?)^```/gm;
const tidy = (s) => s.trim().split('\n').map((l) => l.trimEnd()).join('\n');
const needsOtherFiles = (code) => /^import "(?!vex:)/m.test(code) || /^\s*(pub\s+)?extern\s+fn/m.test(code);

const pages = fs.readdirSync(docs, { recursive: true }).filter((f) => f.endsWith('.mdx') && !f.startsWith('examples'));
let checked = 0;
let skipped = 0;
const failures = [];

for (const page of pages.sort()) {
  const text = fs.readFileSync(path.join(docs, page), 'utf8');
  const blocks = [...text.matchAll(fence)].map((m) => ({ lang: m[1], meta: m[2], body: m[3], at: m.index, end: m.index + m[0].length }));
  blocks.forEach((block, i) => {
    const output = blocks[i + 1];
    if (block.lang !== 'vex' || !block.body.includes('fn main')) return;
    if (!output || output.lang !== 'text' || !output.meta.includes('Output') || text.slice(block.end, output.at).trim()) return;
    if (needsOtherFiles(block.body)) return void skipped++;
    checked++;

    // Diagnostics name the file, so the program is saved under the name the page uses.
    const named = block.meta.match(/title="([^"]+\.vx)"/) ?? output.body.match(/--> ([\w./-]+?\.vx)/);
    const name = named ? path.basename(named[1]) : 'main.vx';
    const dir = fs.mkdtempSync(path.join(work, 'p-'));
    fs.writeFileSync(path.join(dir, name), block.body);
    const run = spawnSync(vex, ['run', name], { cwd: dir, input: '', encoding: 'utf8', timeout: 60_000, env: { ...process.env, NO_COLOR: '1' } });
    const want = tidy(output.body);
    // A terminal shows warnings before the output, so either order matches.
    const seen = [run.stdout + run.stderr, run.stderr + run.stdout, run.stdout].map(tidy);
    if (!seen.includes(want)) {
      const line = text.slice(0, block.at).split('\n').length;
      failures.push({ where: `content/docs/${page}:${line}`, want, got: run.error ? String(run.error) : seen[1] });
    }
  });
}

fs.rmSync(work, { recursive: true, force: true });
for (const f of failures) console.log(`\n${f.where}\n--- shown\n${f.want}\n--- printed now\n${f.got}`);
console.log(`\n${checked - failures.length} of ${checked} programs print what the docs show; ${skipped} need files the page doesn't show and were skipped.`);
process.exit(failures.length ? 1 : 0);
