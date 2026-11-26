import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource-variable/outfit';
import '@fontsource-variable/jetbrains-mono';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Vex · Readable code. Native speed.', template: '%s · Vex' },
  description: 'A compiled, statically typed, general-purpose programming language with readable syntax and native performance.',
  icons: { icon: '/favicon.svg' },
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
