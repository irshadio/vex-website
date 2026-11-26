import { loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import vexGrammar from './vex/vex.tmLanguage.json';
import vexTheme from './vex/theme.json';

const vexIcon =
  '<svg viewBox="0 0 116 100" fill="none"><path d="M0 0H34.5238L70.4286 99.4286H45.5714L0 0Z" fill="#2563EB"/><path d="M116 0H81.4763L45.5715 99.4286H70.4287L116 0Z" fill="#38BDF8"/><path d="M58.0001 65.043L70.4287 99.4287H45.5715L58.0001 65.043Z" fill="#1E3A8A"/></svg>';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    mdxOptions: applyMdxPreset({
      rehypeCodeOptions: {
        // Code stays dark in both themes, as in the brand guide.
        themes: { light: vexTheme as never, dark: vexTheme as never },
        langs: [vexGrammar as never, 'sh', 'bash', 'toml', 'c', 'go'],
        icon: { extend: { vex: vexIcon } },
      },
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});
