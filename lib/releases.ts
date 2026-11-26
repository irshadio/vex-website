export type Channel = 'stable' | 'beta';

/// A platform that release builds are published for.
export interface Platform {
  id: string;
  os: 'macos' | 'linux';
  arch: 'arm64' | 'x64';
  label: string;
  detail: string;
}

export const platforms: Platform[] = [
  { id: 'macos-arm64', os: 'macos', arch: 'arm64', label: 'macOS', detail: 'Apple silicon' },
  { id: 'macos-x64', os: 'macos', arch: 'x64', label: 'macOS', detail: 'Intel' },
  { id: 'linux-x64', os: 'linux', arch: 'x64', label: 'Linux', detail: 'x64' },
  { id: 'linux-arm64', os: 'linux', arch: 'arm64', label: 'Linux', detail: 'ARM64' },
];

/// One downloadable file of a release.
export interface Asset {
  name: string;
  url: string;
  size: number;
}

/// A published release in one channel.
export interface Release {
  version: string;
  date: string;
  notesUrl: string;
  assets: Record<string, Asset>;
  checksums?: Asset;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string; browser_download_url: string; size: number }[];
}

export const releasesApi = 'https://api.github.com/repos/irshadio/vex-lang/releases?per_page=30';

// Archives are named vex-<version>-<os>-<arch>.tar.gz, for example vex-0.2.0-macos-arm64.tar.gz.
const assetPattern = /^vex-.+-(macos|linux)-(arm64|x64)\.tar\.gz$/;

function toRelease(r: GitHubRelease): Release {
  const assets: Record<string, Asset> = {};
  let checksums: Asset | undefined;
  for (const a of r.assets) {
    const asset = { name: a.name, url: a.browser_download_url, size: a.size };
    const m = assetPattern.exec(a.name);
    if (m) assets[`${m[1]}-${m[2]}`] = asset;
    else if (a.name === 'SHA256SUMS') checksums = asset;
  }
  return {
    version: r.tag_name.replace(/^v/, ''),
    date: r.published_at,
    notesUrl: r.html_url,
    assets,
    checksums,
  };
}

/// Returns the newest stable release and the newest beta (pre-release) from the GitHub API response.
export function pickReleases(list: GitHubRelease[]): Record<Channel, Release | null> {
  const published = list.filter((r) => !r.draft);
  const stable = published.find((r) => !r.prerelease);
  const beta = published.find((r) => r.prerelease);
  return { stable: stable ? toRelease(stable) : null, beta: beta ? toRelease(beta) : null };
}

/// Returns the platform id that matches the visitor's browser, if it can tell.
export function detectPlatform(): string | null {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) return 'macos-arm64';
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return /aarch64|arm64/i.test(ua) ? 'linux-arm64' : 'linux-x64';
  return null;
}
