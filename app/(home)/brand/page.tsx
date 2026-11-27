import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import type { ReactNode } from 'react';
import { Download, X } from 'lucide-react';
import { PageHeader } from '@/components/pages/page-header';
import { Footer } from '@/components/home/footer';
import { Mark } from '@/components/logo';
import { cn } from '@/lib/cn';

export const metadata: Metadata = pageMetadata({
  title: 'Brand',
  description: 'The Vex logo, colors, typefaces and name, with files to download and rules for using them.',
  path: '/brand',
});

const logos = [
  { name: 'Primary lockup', use: 'Docs, websites and READMEs', file: 'vex-lockup-light', bg: 'bg-white border border-fd-border' },
  { name: 'Primary lockup, dark', use: 'Dark backgrounds', file: 'vex-lockup-dark', bg: 'bg-night border border-fd-border' },
  { name: 'Stacked', use: 'Square spaces and splash screens', file: 'vex-stacked-light', bg: 'bg-[#f1f5f9]', alt: 'vex-stacked-dark' },
  { name: 'Mark', use: 'Favicons, avatars and small spaces', file: 'vex-mark', bg: 'bg-white border border-fd-border', png: true },
  { name: 'One color, dark', use: 'Print and single-ink use', file: 'vex-lockup-black', bg: 'bg-white border border-fd-border' },
  { name: 'One color, light', use: 'Photos and brand blue', file: 'vex-lockup-white', bg: 'bg-ocean' },
];

const brandColors = [
  { name: 'Ocean Blue', hex: '#2563EB', rgb: '37 99 235', role: 'Primary. The left arm of the mark, links and buttons.', ink: 'text-white' },
  { name: 'Sky', hex: '#38BDF8', rgb: '56 189 248', role: 'The right arm, highlights and focus.', ink: 'text-ink' },
  { name: 'Deep', hex: '#1E3A8A', rgb: '30 58 138', role: 'The overlap, pressed states and headings on light.', ink: 'text-white' },
];

const neutrals = [
  { name: 'Night', hex: '#0B1220' },
  { name: 'Ink', hex: '#0F172A' },
  { name: 'Slate', hex: '#64748B' },
  { name: 'Line', hex: '#E2E8F0' },
  { name: 'Mist', hex: '#F1F5F9' },
  { name: 'White', hex: '#FFFFFF' },
];

const balance = [
  { name: 'White', share: 55, color: '#FFFFFF' },
  { name: 'Night', share: 25, color: '#0B1220' },
  { name: 'Ocean Blue', share: 12, color: '#2563EB' },
  { name: 'Sky', share: 5, color: '#38BDF8' },
  { name: 'Deep', share: 3, color: '#1E3A8A' },
];

const typefaces = [
  { name: 'Outfit', role: 'Display', note: 'The wordmark in ExtraLight, headings in Light. Round, open and calm.', className: 'font-display font-light' },
  { name: 'Inter', role: 'Interface and body', note: 'Docs, interfaces and long text. Neutral and very readable.', className: 'font-sans' },
  { name: 'JetBrains Mono', role: 'Code', note: 'Code samples, command output and file names.', className: 'font-mono' },
];

const scale = [
  { level: 'Display', spec: 'Outfit Light · 64 / 72', sample: 'Readable code.', className: 'font-display text-4xl font-light md:text-[64px] md:leading-[72px]' },
  { level: 'Heading 1', spec: 'Outfit Light · 48 / 56', sample: 'Native speed', className: 'font-display text-3xl font-light md:text-5xl' },
  { level: 'Heading 2', spec: 'Outfit Regular · 32 / 40', sample: 'Getting started', className: 'font-display text-2xl md:text-[32px] md:leading-10' },
  { level: 'Body', spec: 'Inter Regular · 16 / 26', sample: 'Vex compiles your code to a small native binary.', className: 'text-base leading-[26px]' },
  { level: 'Code', spec: 'JetBrains Mono · 15 / 24', sample: 'let name = "Vex"', className: 'font-mono text-[15px] leading-6' },
];

const misuse: { rule: string; mark: ReactNode; bg?: string }[] = [
  { rule: 'Stretch or squash it', mark: <Mark className="h-16 scale-x-[1.6] scale-y-[0.7]" /> },
  { rule: 'Change its colors', mark: <Mark className="h-16 hue-rotate-[150deg]" /> },
  { rule: 'Rotate or tilt it', mark: <Mark className="h-16 -rotate-12" /> },
  { rule: 'Add shadows or effects', mark: <Mark className="h-16 drop-shadow-[0_10px_8px_rgba(0,0,0,0.45)]" /> },
  {
    rule: 'Draw it as an outline',
    mark: (
      <svg viewBox="0 0 116 100" fill="none" aria-hidden="true" className="h-16 w-auto">
        <path d="M0 0H34.5238L70.4286 99.4286H45.5714L0 0Z" stroke="#2563EB" strokeWidth="3" />
        <path d="M116 0H81.4763L45.5715 99.4286H70.4287L116 0Z" stroke="#38BDF8" strokeWidth="3" />
      </svg>
    ),
  },
  { rule: 'Place it on low-contrast colors', mark: <Mark className="h-16" />, bg: 'bg-sky' },
];

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-fd-border py-16 last:border-b-0">
      <p className="mb-2 text-[13px] font-semibold tracking-[0.12em] text-ocean uppercase dark:text-blue-400">{eyebrow}</p>
      <h2 className="font-display text-3xl font-light tracking-tight text-fd-foreground md:text-4xl">{title}</h2>
      {intro && <div className="mt-3 max-w-2xl leading-relaxed text-fd-muted-foreground">{intro}</div>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function DownloadLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} download className="inline-flex items-center gap-1.5 rounded-md border border-fd-border px-2.5 py-1 text-xs font-medium text-fd-foreground transition-colors hover:bg-fd-muted">
      <Download className="size-3.5" aria-hidden="true" />
      {label}
    </a>
  );
}

const sections = [
  ['logo', 'Logo'],
  ['mark', 'The mark'],
  ['space', 'Space and size'],
  ['color', 'Color'],
  ['type', 'Typography'],
  ['name', 'The name'],
  ['misuse', 'Misuse'],
];

export default function BrandPage() {
  return (
    <>
      <main>
        <PageHeader eyebrow="Project" title="Brand">
          The Vex logo, colors and typefaces, with files to download. Use them when you write about Vex, link to it or build
          something with it, and keep to the rules below so the logo looks the same everywhere.
        </PageHeader>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-[180px_minmax(0,1fr)]">
          <nav aria-label="On this page" className="hidden pt-16 lg:block">
            <ol className="sticky top-24 grid gap-1 border-l border-fd-border">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-fd-muted-foreground hover:border-ocean hover:text-fd-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="min-w-0">
            <Section id="logo" eyebrow="01" title="One logo, six forms" intro="Use the primary lockup by default, and the dark version on dark backgrounds. All files are vector SVGs with no background.">
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {logos.map((l) => (
                  <figure key={l.file}>
                    <div className={cn('flex h-44 items-center justify-center rounded-2xl px-8', l.bg)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/brand/${l.file}.svg`} alt={`Vex ${l.name.toLowerCase()}`} className={l.file.startsWith('vex-stacked') ? 'h-24 w-auto' : l.file === 'vex-mark' ? 'h-20 w-auto' : 'h-12 w-auto'} />
                    </div>
                    <figcaption className="mt-3">
                      <p className="text-sm font-medium text-fd-foreground">{l.name}</p>
                      <p className="text-sm text-fd-muted-foreground">{l.use}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <DownloadLink href={`/brand/${l.file}.svg`} label="SVG" />
                        {l.alt && <DownloadLink href={`/brand/${l.alt}.svg`} label="SVG, dark" />}
                        {l.png && <DownloadLink href="/brand/vex-mark.png" label="PNG, 512 px" />}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Section>

            <Section id="mark" eyebrow="02" title="Two arms, one V">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="flex h-72 items-center justify-center rounded-2xl border border-fd-border bg-white">
                  <Mark className="h-40" />
                </div>
                <div className="grid gap-6">
                  <p className="text-lg leading-relaxed text-fd-foreground">The Vex mark is a V made of two flat arms that fold over each other at the base.</p>
                  <ul className="grid gap-4">
                    {brandColors.map((c, i) => (
                      <li key={c.name} className="flex items-center gap-4">
                        <span className="size-9 shrink-0 rounded-md" style={{ backgroundColor: c.hex }} />
                        <span>
                          <span className="block text-sm font-medium text-fd-foreground">{['Left arm', 'Right arm', 'The overlap'][i]}</span>
                          <span className="block text-sm text-fd-muted-foreground">{c.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">Flat color, sharp geometry, no gradients or effects. The mark should feel precise, like the compiler behind it.</p>
                </div>
              </div>
            </Section>

            <Section id="space" eyebrow="03" title="Space and size">
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-xl text-fd-foreground">Clear space</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">Keep at least one arm width empty on every side of the logo.</p>
                  <div className="mt-6 inline-flex rounded-xl border border-dashed border-ocean/50 bg-white p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/vex-lockup-light.svg" alt="Vex primary lockup with clear space" className="h-12 w-auto" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl text-fd-foreground">Minimum size</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">Below these sizes the logo loses clarity.</p>
                  <dl className="mt-6 grid gap-4">
                    {[16, 24, 48].map((px) => (
                      <div key={px} className="flex items-center gap-6">
                        <dt className="flex w-12 justify-center">
                          <Mark className="w-auto" style={{ height: px * (100 / 116) }} />
                        </dt>
                        <dd className="text-sm text-fd-muted-foreground">Mark · {px} px wide</dd>
                      </div>
                    ))}
                    <div className="flex items-center gap-6">
                      <dt>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/brand/vex-lockup-light.svg" alt="" className="w-20 dark:hidden" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/brand/vex-lockup-dark.svg" alt="" className="hidden w-20 dark:block" />
                      </dt>
                      <dd className="text-sm text-fd-muted-foreground">Lockup · 80 px wide</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Section>

            <Section id="color" eyebrow="04" title="Ocean palette" intro="Three blues from the mark, on a calm set of neutrals. Mostly white and night, with blue as the accent.">
              <div className="grid gap-6 md:grid-cols-3">
                {brandColors.map((c) => (
                  <div key={c.name}>
                    <div className={cn('flex h-48 flex-col justify-between rounded-2xl p-6', c.ink)} style={{ backgroundColor: c.hex }}>
                      <span className="font-display text-xl">{c.name}</span>
                      <span>
                        <span className="block font-mono text-sm font-medium">{c.hex}</span>
                        <span className="block font-mono text-xs opacity-80">RGB {c.rgb}</span>
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-fd-muted-foreground">{c.role}</p>
                  </div>
                ))}
              </div>
              <h3 className="mt-12 text-sm font-semibold text-fd-foreground">Neutrals</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {neutrals.map((n) => (
                  <div key={n.name}>
                    <div className="h-20 rounded-xl border border-fd-border" style={{ backgroundColor: n.hex }} />
                    <p className="mt-2 text-sm text-fd-foreground">{n.name}</p>
                    <p className="font-mono text-xs text-fd-muted-foreground">{n.hex}</p>
                  </div>
                ))}
              </div>
              <h3 className="mt-12 text-sm font-semibold text-fd-foreground">Balance</h3>
              <div className="mt-4 flex h-7 overflow-hidden rounded-md border border-fd-border">
                {balance.map((b) => (
                  <span key={b.name} title={`${b.name} ${b.share}%`} style={{ width: `${b.share}%`, backgroundColor: b.color }} />
                ))}
              </div>
              <p className="mt-2 text-xs text-fd-muted-foreground">{balance.map((b) => `${b.name} ${b.share}%`).join(' · ')}</p>
            </Section>

            <Section id="type" eyebrow="05" title="Three typefaces, clear roles" intro="All three are free and open source.">
              <div className="grid gap-6 md:grid-cols-3">
                {typefaces.map((t) => (
                  <div key={t.name} className="rounded-2xl border border-fd-border p-6">
                    <p className={cn('text-7xl text-fd-foreground', t.className)}>Aa</p>
                    <p className="mt-6 font-medium text-fd-foreground">{t.name}</p>
                    <p className="text-sm text-fd-muted-foreground">{t.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">{t.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 grid divide-y divide-fd-border border-y border-fd-border">
                {scale.map((s) => (
                  <div key={s.level} className="grid gap-2 py-4 md:grid-cols-[120px_200px_minmax(0,1fr)] md:items-center">
                    <span className="text-sm text-fd-foreground">{s.level}</span>
                    <span className="text-xs text-fd-muted-foreground">{s.spec}</span>
                    <span className={cn('truncate text-fd-foreground', s.className)}>{s.sample}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="name" eyebrow="06" title="Writing the name">
              <dl className="grid divide-y divide-fd-border border-y border-fd-border">
                {[
                  ['Vex', 'In sentences: “Vex compiles to native code.”'],
                  ['vex', 'Only in the wordmark, the command and file names: vex run, main.vx'],
                  ['VEX · Vex-lang · VeX', 'Never'],
                ].map(([name, rule]) => (
                  <div key={name} className="grid gap-1 py-4 md:grid-cols-[240px_minmax(0,1fr)]">
                    <dt className="font-medium text-fd-foreground">{name}</dt>
                    <dd className="text-fd-muted-foreground">{rule}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section id="misuse" eyebrow="07" title="Please don't">
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {misuse.map((m) => (
                  <figure key={m.rule}>
                    <div className={cn('relative flex h-40 items-center justify-center overflow-hidden rounded-2xl', m.bg ?? 'border border-fd-border bg-white')}>
                      <span className="absolute top-3 left-3 flex size-6 items-center justify-center rounded-full bg-red-600 text-white">
                        <X className="size-3.5" aria-hidden="true" />
                      </span>
                      {m.mark}
                    </div>
                    <figcaption className="mt-3 text-sm font-medium text-fd-foreground">{m.rule}</figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
