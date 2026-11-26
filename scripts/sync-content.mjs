// Generates the examples and roadmap content from the language repository.
// Run with `npm run sync`.
// VEX_LANG_DIR points at a checkout of vex-lang (default: ../VEX).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const lang = path.resolve(process.env.VEX_LANG_DIR ?? path.join(root, '..', '..', 'VEX'));
const docs = path.join(root, 'content', 'docs');

const read = (p) => fs.readFileSync(path.join(lang, p), 'utf8');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const yaml = (s) => JSON.stringify(s);

// Example pages in learning order; examples not listed here come last, alphabetically.
const exampleOrder = ['hello', 'fizzbuzz', 'fibonacci', 'structs', 'enums', 'optionals', 'errors', 'closures', 'maps', 'generics', 'interfaces', 'primes', 'sorting', 'input'];
const rank = (n) => (exampleOrder.includes(n) ? exampleOrder.indexOf(n) : exampleOrder.length);

/** Rewrites code fences and links so they work on the site. */
function adapt(md) {
  return md
    .replace(/^```swift$/gm, '```vex')
    .replace(/\]\((?:\.\.\/|docs\/)?SYNTAX\.md(#[^)]*)?\)/g, '](/docs/language)')
    .replace(/\]\(examples\/([a-z]+)\.vx\)/g, '](/docs/examples/$1)')
    .replace(/\]\((?:\.\.\/)*BACKLOG\.md\)/g, '](/roadmap)');
}

/** Returns the first sentence of a file's leading comment, without its period. */
function leadComment(src) {
  const lines = [];
  for (const l of src.split('\n')) {
    if (!l.startsWith('//')) break;
    lines.push(l.replace(/^\/\/\s?/, ''));
  }
  const text = lines.join(' ').trim();
  const sentence = (text.match(/^(.+?)\.(\s|$)/)?.[1] ?? text).replace(/^\w+:\s+/, '');
  return sentence[0].toUpperCase() + sentence.slice(1);
}

// Example programs with their expected output.
function syncExamples() {
  const readme = read('README.md');
  const notes = Object.fromEntries([...readme.matchAll(/^\| \[([a-z]+)\.vx\]\(examples\/[a-z]+\.vx\) \| (.+?) \|$/gm)].map((m) => [m[1], m[2]]));
  const dir = path.join(docs, 'examples');
  fs.rmSync(dir, { recursive: true, force: true });
  const names = fs
    .readdirSync(path.join(lang, 'examples'))
    .filter((f) => f.endsWith('.vx'))
    .map((f) => f.slice(0, -3))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  const titles = {};
  for (const name of names) {
    const src = read(`examples/${name}.vx`).replace(/^\/\/ Run:.*\n\n?/, '');
    const out = fs.existsSync(path.join(lang, `examples/${name}.out`)) ? read(`examples/${name}.out`) : '';
    const input = fs.existsSync(path.join(lang, `examples/${name}.in`)) ? read(`examples/${name}.in`) : '';
    if (!notes[name]) notes[name] = leadComment(src);
    const title = name[0].toUpperCase() + name.slice(1);
    titles[name] = title;
    const note = notes[name] ? adapt(notes[name]).replace(/\|/g, '') : '';
    let body = note ? `${note}.\n\n` : '';
    body += `\`\`\`vex title="${name}.vx"\n${src.trimEnd()}\n\`\`\`\n\nRun it with:\n\n\`\`\`sh\nvex run ${name}.vx\n\`\`\`\n`;
    if (input) body += `\nInput:\n\n\`\`\`text\n${input.trimEnd()}\n\`\`\`\n`;
    if (out) body += `\nOutput:\n\n\`\`\`text\n${out.trimEnd()}\n\`\`\`\n`;
    write(path.join(dir, `${name}.md`), `---\ntitle: ${yaml(title)}\ndescription: ${yaml(note ? note.replace(/`/g, '') + '.' : `The ${name} example program.`)}\n---\n\n${body}`);
  }
  write(
    path.join(dir, 'index.md'),
    `---\ntitle: Examples\ndescription: ${yaml('Small, complete Vex programs, each with its expected output.')}\n---\n\n| Example | Shows |\n|---|---|\n${names
      .map((n) => `| [${titles[n]}](/docs/examples/${n}) | ${notes[n] ? adapt(notes[n]) : ''} |`)
      .join('\n')}\n`,
  );
  write(path.join(dir, 'meta.json'), JSON.stringify({ title: 'Examples', pages: ['index', ...names] }, null, 2) + '\n');
  return names.length;
}

// Phases that belong to the Vex UI framework, which gets its own site; the backlog builds phases 3 to 5 in vex-ui.
const uiPhases = new Set(['UI core', 'iOS backend', 'Android backend', 'App essentials']);

// Roadmap data for the language from the backlog.
function syncRoadmap() {
  const md = read('BACKLOG.md');
  const phases = [];
  let phase = null;
  let section = null;
  for (const line of md.split('\n')) {
    const ph = line.match(/^## Phase (\d+): (.+?)(?: \((v[\d.+]+)\))?$/);
    if (ph) {
      phase = { number: Number(ph[1]), title: ph[2], version: ph[3] ?? null, goal: null, sections: [] };
      section = null;
      phases.push(phase);
      continue;
    }
    if (line.startsWith('## ')) {
      phase = null;
      continue;
    }
    if (!phase) continue;
    const goal = line.match(/^Goal: (.+)$/);
    if (goal) phase.goal = goal[1];
    const sec = line.match(/^### (?:[\d.]+ )?(.+)$/);
    if (sec) {
      section = { title: sec[1], tasks: [] };
      phase.sections.push(section);
      continue;
    }
    const task = line.match(/^- \[([ x~])\] \*\*(V-\d+)\*\* (.+?)(?: \((S|M|L|XL)\))?$/);
    if (task) {
      if (!section) {
        section = { title: null, tasks: [] };
        phase.sections.push(section);
      }
      const text = task[3].replace(/ \(\[[^\]]+\]\([^)]+\)\)/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      section.tasks.push({ id: task[2], text, status: task[1] === 'x' ? 'done' : task[1] === '~' ? 'active' : 'todo', size: task[4] ?? null });
    }
  }
  const language = phases.filter((p) => !uiPhases.has(p.title));
  write(path.join(root, 'lib', 'generated', 'roadmap.json'), JSON.stringify(language, null, 2) + '\n');
  return language.length;
}

const e = syncExamples();
const p = syncRoadmap();
console.log(`Synced ${e} examples and ${p} roadmap phases from ${lang}`);
