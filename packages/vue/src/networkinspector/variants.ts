export interface NetworkHeader {
  name: string;
  value: string;
}

export interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status?: number;
  type?: string;
  size?: number;
  duration?: number;
  start?: number;
  end?: number;
  requestHeaders?: NetworkHeader[] | Record<string, string>;
  responseHeaders?: NetworkHeader[] | Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  error?: string;
}

export function formatBytes(n: number | undefined): string {
  if (n === undefined || n < 0) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} kB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function formatDuration(ms: number | undefined): string {
  if (ms === undefined || ms < 0) return '—';
  if (ms < 1) return `${ms.toFixed(2)} ms`;
  if (ms < 1000) return `${ms.toFixed(0)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function statusTone(status: number | undefined): 'success' | 'warning' | 'error' | 'info' | 'default' {
  if (status === undefined) return 'default';
  if (status >= 500) return 'error';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'info';
  if (status >= 200) return 'success';
  return 'default';
}

export function normalizeHeaders(
  h: NetworkHeader[] | Record<string, string> | undefined,
): NetworkHeader[] {
  if (!h) return [];
  if (Array.isArray(h)) return h;
  return Object.entries(h).map(([name, value]) => ({ name, value }));
}
