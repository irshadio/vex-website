'use client';
import { Apple, Check, Download, Info, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  type Channel,
  type Release,
  detectPlatform,
  pickReleases,
  platforms,
  releasesApi,
} from '@/lib/releases';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; releases: Record<Channel, Release | null> };

const channels: { id: Channel; label: string; note: string }[] = [
  { id: 'stable', label: 'Stable', note: 'Tested releases, recommended for most people.' },
  { id: 'beta', label: 'Beta', note: 'Preview of the next release. Expect rough edges.' },
];

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });

/// Release downloads for each channel and platform, read live from GitHub Releases.
export function Downloads() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [channel, setChannel] = useState<Channel>('stable');
  const [mine, setMine] = useState<string | null>(null);

  useEffect(() => {
    setMine(detectPlatform());
    fetch(releasesApi, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list) => setState({ status: 'ready', releases: pickReleases(list) }))
      .catch(() => setState({ status: 'error' }));
  }, []);

  const release = state.status === 'ready' ? state.releases[channel] : null;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-background">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fd-border bg-fd-card px-5 py-4">
        <div role="tablist" aria-label="Release channel" className="inline-flex rounded-xl border border-fd-border bg-fd-muted p-1">
          {channels.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={channel === c.id}
              onClick={() => setChannel(c.id)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors',
                channel === c.id ? 'bg-fd-background text-fd-foreground shadow-sm' : 'text-fd-muted-foreground hover:text-fd-foreground',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        {release && (
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono font-medium text-ocean dark:bg-blue-950 dark:text-blue-300">
              v{release.version}
            </span>
            <span className="text-fd-muted-foreground">{formatDate(release.date)}</span>
          </div>
        )}
      </div>

      <p className="px-5 pt-4 text-sm text-fd-muted-foreground">{channels.find((c) => c.id === channel)!.note}</p>

      <div className="p-5 pt-3">
        {state.status === 'loading' && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {platforms.map((p) => (
              <div key={p.id} className="h-[68px] animate-pulse rounded-xl bg-fd-muted" />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <Notice>
            Couldn&apos;t load the release list. Try again later, or{' '}
            <a href="#build-from-source" className="font-medium text-ocean underline dark:text-blue-400">
              build Vex from source
            </a>
            .
          </Notice>
        )}

        {state.status === 'ready' && !release && (
          <Notice>
            There is no {channel} release yet. Vex is in early development, so for now{' '}
            <a href="#build-from-source" className="font-medium text-ocean underline dark:text-blue-400">
              build it from source
            </a>
            . Releases will appear here as soon as they are published.
          </Notice>
        )}

        {release && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {platforms.map((p) => {
              const asset = release.assets[p.id];
              const isMine = p.id === mine;
              const Icon = p.os === 'macos' ? Apple : Terminal;
              return (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3',
                    isMine ? 'border-blue-300 bg-blue-50/60 dark:border-blue-800 dark:bg-blue-950/40' : 'border-fd-border',
                  )}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-fd-muted text-fd-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
                      {p.label} <span className="font-normal text-fd-muted-foreground">{p.detail}</span>
                      {isMine && (
                        <span className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-ocean px-1.5 py-px text-[10px] font-semibold text-white">
                          <Check className="size-2.5" /> Your system
                        </span>
                      )}
                    </p>
                    <p className="truncate font-mono text-xs text-fd-muted-foreground">{asset ? `${asset.name} · ${formatSize(asset.size)}` : 'Not available'}</p>
                  </div>
                  {asset && (
                    <a
                      href={asset.url}
                      aria-label={`Download for ${p.label} ${p.detail}`}
                      className={cn(
                        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors',
                        isMine ? 'bg-ocean text-white hover:bg-[#1d4ed8]' : 'border border-fd-border hover:bg-fd-muted',
                      )}
                    >
                      <Download className="size-4" /> Download
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {release?.checksums && (
          <p className="mt-4 text-xs text-fd-muted-foreground">
            Verify downloads with{' '}
            <a href={release.checksums.url} className="font-mono underline">
              SHA256SUMS
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-fd-border bg-fd-card p-4 text-sm leading-relaxed">
      <Info className="mt-0.5 size-4 shrink-0 text-ocean dark:text-blue-400" />
      <p>{children}</p>
    </div>
  );
}
