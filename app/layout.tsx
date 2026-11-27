import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource-variable/outfit';
import '@fontsource-variable/jetbrains-mono';
import { Provider } from '@/components/provider';
import { appName } from '@/lib/shared';
import { pageMetadata, siteDescription, siteUrl, tagline } from '@/lib/metadata';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const { alternates: _, ...shared } = pageMetadata({ description: siteDescription, path: '/' });

export const metadata: Metadata = {
  ...shared,
  metadataBase: new URL(siteUrl),
  title: { default: `${appName} · ${tagline}`, template: `%s · ${appName}` },
  applicationName: appName,
  keywords: ['Vex', 'programming language', 'compiled', 'statically typed', 'native'],
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased" suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
