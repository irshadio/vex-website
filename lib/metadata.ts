import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vexlang.web.app';
export const tagline = 'Readable code. Native speed.';
export const siteDescription =
  'A compiled, statically typed, general-purpose programming language with readable syntax and native performance.';

const image = { url: '/og.png', width: 1200, height: 630, alt: `${appName} · ${tagline}` };

/// Title, description, canonical URL and share previews for one page.
/// Open Graph and Twitter fields don't inherit the page title, so they are set here for every page.
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const shareTitle = title ? `${title} · ${appName}` : `${appName} · ${tagline}`;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: appName, locale: 'en_US', url: path, title: shareTitle, description, images: [image] },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [image] },
  };
}
