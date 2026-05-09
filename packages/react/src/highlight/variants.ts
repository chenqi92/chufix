export interface HighlightProps {
  text: string;
  match?: string | RegExp;
  caseSensitive?: boolean;
  className?: string;
}

export interface HighlightSegment {
  text: string;
  hit: boolean;
}

export function highlightClass(p: { className?: string }): string {
  return ['cf-highlight', p.className].filter(Boolean).join(' ');
}

export function splitByMatch(
  text: string,
  match: string | RegExp | undefined,
  caseSensitive: boolean,
): HighlightSegment[] {
  if (!text) return [];
  if (!match) return [{ text, hit: false }];
  let re: RegExp;
  if (match instanceof RegExp) {
    const flags = match.flags.includes('g') ? match.flags : `${match.flags}g`;
    re = new RegExp(match.source, flags);
  } else {
    if (!match) return [{ text, hit: false }];
    const escaped = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    re = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
  }
  const out: HighlightSegment[] = [];
  let cursor = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > cursor) out.push({ text: text.slice(cursor, start), hit: false });
    out.push({ text: m[0], hit: true });
    cursor = start + m[0].length;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), hit: false });
  return out;
}
