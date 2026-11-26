// Finds the vex-lang checkout: VEX_LANG_DIR, or a VEX folder next to the site or next to its worktrees folder.
import fs from 'node:fs';
import path from 'node:path';

export function langDir(root) {
  if (process.env.VEX_LANG_DIR) return path.resolve(process.env.VEX_LANG_DIR);
  const found = [path.join(root, '..', 'VEX'), path.join(root, '..', '..', 'VEX')].find((d) => fs.existsSync(path.join(d, 'go.mod')));
  if (!found) throw new Error('Set VEX_LANG_DIR to a checkout of vex-lang; none was found at ../VEX');
  return path.resolve(found);
}
