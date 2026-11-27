import type { MetadataRoute } from 'next';
import { siteDescription } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vex',
    short_name: 'Vex',
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#2563EB',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/vex-mark.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
