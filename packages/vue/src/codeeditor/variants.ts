export type CodeEditorSize = 'sm' | 'md' | 'lg';

export interface CodeEditorProps {
  modelValue?: string;
  language?: string;
  size?: CodeEditorSize;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  /** Visible rows (height in lines). */
  rows?: number;
  /** Soft-wrap long lines. */
  wrap?: boolean;
  /** Tab key inserts spaces (default 2). 0 disables and lets Tab focus next field. */
  tabSize?: number;
}

export function lineCount(s: string): number {
  if (!s) return 1;
  let n = 1;
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 10) n += 1;
  return n;
}

export function buildLineNumbers(n: number): string[] {
  const out: string[] = [];
  for (let i = 1; i <= n; i++) out.push(String(i));
  return out;
}
