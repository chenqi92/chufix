export type CodeEditorSize = 'sm' | 'md' | 'lg';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  size?: CodeEditorSize;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  wrap?: boolean;
  tabSize?: number;
  className?: string;
}

export function lineCount(s: string): number {
  if (!s) return 1;
  let n = 1;
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 10) n += 1;
  return n;
}

export function buildLineNumbers(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}
