# vex-website

The website for the [Vex](https://github.com/irshadio/vex-lang) programming language, built with [Next.js](https://nextjs.org), [Fumadocs](https://fumadocs.dev) and Tailwind CSS. It is exported as a static site.

## Development

Requires Node 20 or newer.

```sh
npm install
npm run dev      # start the dev server at localhost:3000
npm run build    # build the static site into out/
npm start        # serve the built site
```

## Content from the language repository

Some content is generated from a checkout of [vex-lang](https://github.com/irshadio/vex-lang), found at `../VEX` or at `VEX_LANG_DIR`. The generated files are committed, so building the site doesn't need the checkout.

```sh
npm run sync        # examples, playground examples and roadmap
npm run playground  # the playground's compiler, built to WebAssembly (needs Go)
npm run bench       # benchmark results
```

The rest of the documentation is written by hand. Every Vex code block in it is compiled and run with the `vex` compiler, and the output shown is the real output.

## Playground

`/playground` runs the Vex compiler in the browser, built from `playground/main.go` into `public/playground/`. It checks programs as you type. Example programs replay the terminal session recorded by `npm run sync`, which builds each example and types its `.in` lines at its prompts.

Running edited programs needs a run service. Set `NEXT_PUBLIC_VEX_RUN_URL` at build time to its address. The playground sends:

```http
POST <NEXT_PUBLIC_VEX_RUN_URL>
Content-Type: application/json

{ "source": "fn main() { ... }", "input": ["Ann", "3"] }
```

For a program that calls `input()`, the visitor types its lines in the output terminal first, and they arrive as `input`. The service types each line once the program has printed its prompt and gone quiet, and answers with the session in order, so prompts and answers appear together:

```json
{ "session": [{ "out": "Name? " }, { "in": "Ann" }, { "out": "Hi, Ann\n" }, { "err": "..." }], "exitCode": 0 }
```

`scripts/sync-content.mjs` records the examples' sessions the same way (`recordSession`). The service must compile with `vex build` and run the program in a sandbox with limits on time, memory, processes, files and network.

## Layout

| Path | Contents |
|---|---|
| `app/(home)/` | The home page, playground, benchmarks and roadmap |
| `app/docs/` | The documentation layout and pages |
| `content/docs/` | Documentation, written in MDX |
| `components/home/` | Sections of the home page |
| `components/ui/` | Shared UI components |
| `components/playground/` | The playground editor and panels |
| `playground/` | The WebAssembly wrapper around the Vex compiler |
| `scripts/` | Content sync and the playground build |
| `lib/generated/` | Generated data: examples, roadmap, benchmarks |
| `lib/vex/` | The Vex syntax grammar and code theme |
