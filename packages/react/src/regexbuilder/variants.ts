export type RegexBuilderSize = 'sm' | 'md' | 'lg';

export type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

export const ALL_FLAGS: { flag: RegexFlag; label: string; desc: string }[] = [
  { flag: 'g', label: 'g', desc: '全局匹配' },
  { flag: 'i', label: 'i', desc: '忽略大小写' },
  { flag: 'm', label: 'm', desc: '多行模式' },
  { flag: 's', label: 's', desc: '单行 (.)' },
  { flag: 'u', label: 'u', desc: 'Unicode' },
  { flag: 'y', label: 'y', desc: '粘连匹配' },
];

export interface RegexBuilderProps {
  pattern: string;
  onPatternChange: (value: string) => void;
  flags: string;
  onFlagsChange: (value: string) => void;
  testText: string;
  onTestTextChange: (value: string) => void;
  size?: RegexBuilderSize;
  patternPlaceholder?: string;
  testPlaceholder?: string;
  className?: string;
}

export interface RegexMatch {
  start: number;
  end: number;
  text: string;
  groups?: string[];
}

export interface RegexResult {
  ok: boolean;
  error?: string;
  matches: RegexMatch[];
}

export function compileAndMatch(
  pattern: string,
  flags: string,
  text: string,
): RegexResult {
  if (!pattern) return { ok: true, matches: [] };
  try {
    const fl = flags.includes('g') ? flags : `${flags}g`;
    const re = new RegExp(pattern, fl);
    const out: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    let safety = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index === re.lastIndex) re.lastIndex += 1;
      out.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        groups: m.slice(1),
      });
      if (++safety > 5000) break;
    }
    return { ok: true, matches: out };
  } catch (e) {
    return { ok: false, error: (e as Error).message, matches: [] };
  }
}

export function highlightMatches(
  text: string,
  matches: RegexMatch[],
): { text: string; match: boolean }[] {
  if (!matches.length) return [{ text, match: false }];
  const parts: { text: string; match: boolean }[] = [];
  let last = 0;
  for (const m of matches) {
    if (m.start > last) parts.push({ text: text.slice(last, m.start), match: false });
    parts.push({ text: text.slice(m.start, m.end), match: true });
    last = m.end;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts;
}
