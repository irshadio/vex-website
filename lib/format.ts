/// Formats a duration in seconds as milliseconds below 0.1 s, otherwise as seconds.
export function formatTime(seconds: number) {
  return seconds < 0.1 ? `${(seconds * 1000).toFixed(seconds < 0.01 ? 1 : 0)} ms` : `${seconds.toFixed(2)} s`;
}

/// Formats a byte count as KB below one megabyte, otherwise as MB.
export function formatBytes(bytes: number) {
  return bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}
