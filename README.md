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
npm run sync   # examples and roadmap
npm run bench  # benchmark results
```

The rest of the documentation is written by hand. Every Vex code block in it is compiled and run with the `vex` compiler, and the output shown is the real output.

## Layout

| Path | Contents |
|---|---|
| `app/(home)/` | The home page, benchmarks and roadmap |
| `app/docs/` | The documentation layout and pages |
| `content/docs/` | Documentation, written in MDX |
| `components/home/` | Sections of the home page |
| `components/ui/` | Shared UI components |
| `scripts/` | Content sync |
| `lib/generated/` | Generated data: roadmap and benchmarks |
| `lib/vex/` | The Vex syntax grammar and code theme |
