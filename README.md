# vex-website

The website for the [Vex](https://github.com/irshadio/vex-lang) programming language, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Development

Requires Node 20 or newer.

```sh
npm install
npm run dev      # start the dev server at localhost:4321
npm run build    # build the static site into dist/
npm run preview  # serve the built site
```

## Layout

| Path | Contents |
|---|---|
| `src/content/docs/` | Pages, written in Markdown or MDX |
| `src/assets/` | Images used by pages and the theme |
| `public/` | Files served as is, such as the favicon |
| `astro.config.mjs` | Site config and sidebar |
