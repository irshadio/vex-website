// Runs the Vex and Go suite from the language repository and writes lib/generated/suite.json.
// Run with `npm run bench:suite` on an idle machine. VEX_LANG_DIR points at a checkout of vex-lang (default: ../VEX).
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { langDir } from '../scripts/lang-dir.mjs';

const root = path.resolve(import.meta.dirname, '..');
const lang = langDir(root);
const out = path.join(root, 'lib', 'generated', 'suite.json');
execFileSync('sh', ['bench/run.sh', '--json', out], { cwd: lang, stdio: 'inherit' });
