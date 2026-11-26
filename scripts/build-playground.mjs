// Builds the playground's WebAssembly compiler from the language repository.
// Run with `npm run playground`. VEX_LANG_DIR points at a checkout of vex-lang (default: ../VEX).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { langDir } from './lang-dir.mjs';

const root = path.resolve(import.meta.dirname, '..');
const lang = langDir(root);
const out = path.join(root, 'public', 'playground');

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim();

const commit = run('git', ['-C', lang, 'rev-parse', '--short', 'HEAD']);
const version = `0.1.0-dev+${commit}`;

// A throwaway module that points at the language checkout, so no paths are stored in this repository.
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'vex-playground-'));
fs.copyFileSync(path.join(root, 'playground', 'main.go'), path.join(work, 'main.go'));
fs.writeFileSync(
  path.join(work, 'go.mod'),
  `module playground\n\ngo 1.23\n\nrequire github.com/irshadio/vex-lang v0.0.0\n\nreplace github.com/irshadio/vex-lang => ${lang}\n`,
);

fs.mkdirSync(out, { recursive: true });
run('go', ['build', '-trimpath', '-ldflags', `-s -w -X main.version=${version}`, '-o', path.join(out, 'vex.wasm'), '.'], {
  cwd: work,
  env: { ...process.env, GOOS: 'js', GOARCH: 'wasm' },
});
const goroot = run('go', ['env', 'GOROOT']);
const shim = ['lib/wasm/wasm_exec.js', 'misc/wasm/wasm_exec.js'].map((p) => path.join(goroot, p)).find((p) => fs.existsSync(p));
fs.copyFileSync(shim, path.join(out, 'wasm_exec.js'));
fs.writeFileSync(path.join(out, 'version.json'), JSON.stringify({ version }) + '\n');
fs.rmSync(work, { recursive: true, force: true });

const size = (fs.statSync(path.join(out, 'vex.wasm')).size / 1024 / 1024).toFixed(1);
console.log(`Built playground compiler ${version} (${size} MB) into public/playground`);
