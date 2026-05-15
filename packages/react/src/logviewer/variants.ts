export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  id?: string | number;
  timestamp?: number | string;
  level?: LogLevel;
  message: string;
  source?: string;
}

export function formatTimestamp(t: number | string | undefined): string {
  if (t === undefined) return '';
  if (typeof t === 'string') return t;
  const d = new Date(t);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
}

export function highlight(message: string, query: string): { text: string; match: boolean }[] {
  if (!query) return [{ text: message, match: false }];
  const lower = message.toLowerCase();
  const q = query.toLowerCase();
  const out: { text: string; match: boolean }[] = [];
  let cursor = 0;
  while (cursor < message.length) {
    const idx = lower.indexOf(q, cursor);
    if (idx < 0) {
      out.push({ text: message.slice(cursor), match: false });
      break;
    }
    if (idx > cursor) out.push({ text: message.slice(cursor, idx), match: false });
    out.push({ text: message.slice(idx, idx + q.length), match: true });
    cursor = idx + q.length;
  }
  return out;
}
