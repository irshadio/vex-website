# vex-website

The website for the [Vex](https://github.com/vex-language/vex-lang) programming language, built with [Next.js](https://nextjs.org), [Fumadocs](https://fumadocs.dev) and Tailwind CSS. It is exported as a static site.

## Development

Requires Node 20 or newer.

```sh
npm install
npm run dev      # start the dev server at localhost:3000
npm run build    # build the static site into out/
npm start        # serve the built site
```

## Content from the language repository

Some content is generated from a checkout of [vex-lang](https://github.com/vex-language/vex-lang), found at `../VEX` or at `VEX_LANG_DIR`. The generated files are committed, so building the site doesn't need the checkout.

```sh
npm run sync        # examples, playground examples and roadmap
npm run playground  # the playground's compiler, built to WebAssembly (needs Go)
npm run bench       # benchmark results
```

The rest of the documentation is written by hand. Every Vex code block in it is compiled and run with the `vex` compiler, and the output shown is the real output.

After the language changes, check that the documentation still matches it:

```sh
npm run verify-docs  # runs every complete program and compares it with the Output block under it
```

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

`scripts/sync-content.mjs` records the examples' sessions the same way (`recordSession`).

### Run service

`run-service/` is that service, in Go. It builds each program with `vex build` and runs it:

- as user `nobody` in a temporary folder, with an empty environment;
- with limits of 5 seconds of CPU time, 10 seconds overall, 256 MB of memory (Linux only), 64 KB of output, 1 MB files, 64 open files and a process count per user;
- refusing `vex:os`, `vex:fs` and `extern fn`, which reach the machine running it;
- with 30 runs per minute per visitor and 4 programs at a time.

To try it locally:

```sh
node scripts/build-run-service.mjs
PORT=8080 VEX=../VEX/bin/vex PROCESSES=100000 START_WAIT_MS=6000 run-service/dist/run-service
NEXT_PUBLIC_VEX_RUN_URL=http://localhost:8080/run npm run dev
```

On macOS, the first start of each new program waits a few seconds for the system's malware scan, so `START_WAIT_MS` gives it longer before typing input; the process limit counts all of your own processes, so `PROCESSES` is raised.

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `8080` | Port to listen on |
| `VEX` | `vex` | The compiler |
| `ALLOWED_ORIGINS` | `*` | Comma-separated sites that may call the service |
| `MEMORY_MB` | `256` | Memory per program |
| `PROCESSES` | `256` | Processes and threads for all programs together |
| `MAX_CONCURRENT` | `4` | Programs running at once |
| `RUNS_PER_MINUTE` | `30` | Runs per visitor |
| `START_WAIT_MS` | `3000` | Time a silent program gets to start before input is typed |

To deploy on Google Cloud Run, which runs every container in a gVisor sandbox:

```sh
node scripts/build-run-service.mjs --linux
gcloud run deploy vex-run --source run-service --region <region> \
  --set-env-vars ALLOWED_ORIGINS=<site origin> \
  --memory 2Gi --cpu 2 --concurrency 4 --timeout 60 \
  --allow-unauthenticated
```

Give the service no outbound internet: route its egress through a VPC network without Cloud NAT (`--network <vpc> --subnet <subnet> --vpc-egress all-traffic`). Then build the site with `NEXT_PUBLIC_VEX_RUN_URL=<service URL>/run`.

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
| `run-service/` | The service that runs playground programs |
| `scripts/` | Content sync, and the playground and run service builds |
| `lib/generated/` | Generated data: examples, roadmap, benchmarks |
| `lib/vex/` | The Vex syntax grammar and code theme |
