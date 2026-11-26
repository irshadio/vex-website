import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Download, Library, Map, Rocket } from 'lucide-react';
import { Logo } from '@/components/logo';
import { langRepo } from './shared';

/// Returns the options shared by the home and docs layouts.
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    themeSwitch: { mode: 'light-dark-system' },
    githubUrl: langRepo,
  };
}

/// Returns the home layout options, which add the top navigation links.
export function homeOptions(): BaseLayoutProps {
  return {
    ...baseOptions(),
    links: [
      {
        type: 'menu',
        text: 'Learn',
        items: [
          { text: 'Get started', description: 'Install Vex and run your first program.', url: '/docs/install', icon: <Rocket /> },
          { text: 'Language tour', description: 'The whole language in one page.', url: '/docs/tour', icon: <Map /> },
          { text: 'Language guide', description: 'Syntax and semantics, topic by topic.', url: '/docs/language', icon: <BookOpen /> },
          { text: 'Standard library', description: 'Built-ins and the vex: modules.', url: '/docs/stdlib', icon: <Library /> },
        ],
      },
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Playground', url: '/playground' },
      { text: 'Examples', url: '/docs/examples', active: 'nested-url' },
      { text: 'Benchmarks', url: '/benchmarks' },
      { text: 'Roadmap', url: '/roadmap' },
      { type: 'button', text: 'Install', url: '/docs/install', icon: <Download />, secondary: true },
    ],
  };
}
