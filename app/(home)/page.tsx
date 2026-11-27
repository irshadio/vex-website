import type { Metadata } from 'next';
import { pageMetadata, siteDescription } from '@/lib/metadata';
import { Hero } from '@/components/home/hero';
import { Pillars } from '@/components/home/pillars';
import { Glance } from '@/components/home/glance';
import { Performance } from '@/components/home/performance';
import { Platforms } from '@/components/home/platforms';
import { Pipeline } from '@/components/home/pipeline';
import { RoadmapSummary } from '@/components/home/roadmap-summary';
import { Closing } from '@/components/home/closing';
import { Footer } from '@/components/home/footer';

export const metadata: Metadata = pageMetadata({ description: siteDescription, path: '/' });

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Pillars />
        <Glance />
        <Performance />
        <Platforms />
        <Pipeline />
        <RoadmapSummary />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
