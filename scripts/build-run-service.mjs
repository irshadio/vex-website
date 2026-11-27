// Builds the playground's run service, and with --linux also the vex compiler, into run-service/dist.
// Without --linux it builds the service for this machine, to run locally.
// VEX_LANG_DIR points at a checkout of vex-lang (default: ../VEX).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { langDir } from './lang-dir.mjs';

const root = path.resolve(import.meta.dirname, '..');
const lang = langDir(root);
const src = path.join(root, 'run-service');
const dist = path.join(src, 'dist');
const linux = process.argv.includes('--linux');
const target = linux ? { GOOS: 'linux', GOARCH: 'amd64', CGO_ENABLED: '0' } : {};

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts }).trim();
const commit = run('git', ['-C', lang, 'rev-parse', '--short', 'HEAD']);

// A throwaway module that points at the language checkout, so no paths are stored in this repository.
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'vex-run-service-'));
for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.go'))) fs.copyFileSync(path.join(src, f), path.join(work, f));
fs.writeFileSync(
  path.join(work, 'go.mod'),
  `module runservice\n\ngo 1.23\n\nrequire github.com/vex-language/vex-lang v0.0.0\n\nreplace github.com/vex-language/vex-lang => ${lang}\n`,
);
fs.mkdirSync(dist, { recursive: true });
const env = { ...process.env, ...target };
run('go', ['build', '-trimpath', '-ldflags', '-s -w', '-o', path.join(dist, 'run-service'), '.'], { cwd: work, env });
if (linux) {
  run('go', ['build', '-trimpath', '-ldflags', `-s -w -X main.version=0.1.0-dev+${commit}`, '-o', path.join(dist, 'vex'), './cmd/vex'], { cwd: lang, env });
}
fs.rmSync(work, { recursive: true, force: true });
console.log(`Built the run service${linux ? ' and vex ' + commit + ' for Linux' : ''} into run-service/dist`);
