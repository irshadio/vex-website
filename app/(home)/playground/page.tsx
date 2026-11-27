import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import fs from 'node:fs';
import path from 'node:path';
import { PlaygroundClient } from '@/components/playground/client';
import type { PlaygroundExample } from '@/lib/playground';

export const metadata: Metadata = pageMetadata({
  title: 'Playground',
  description: 'Write Vex in your browser, check it as you type, and try the examples.',
  path: '/playground',
});

function getExamples(): PlaygroundExample[] {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib', 'generated', 'playground.json'), 'utf8')) as PlaygroundExample[];
}

export default function PlaygroundPage() {
  return (
    <main>
      <h1 className="sr-only">Vex playground</h1>
      <PlaygroundClient examples={getExamples()} />
    </main>
  );
}
