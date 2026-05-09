export type JsonDiffSize = 'sm' | 'md' | 'lg';

export interface JsonDiffProps {
  left: unknown;
  right: unknown;
  size?: JsonDiffSize;
  bordered?: boolean;
  lineNumbers?: boolean;
  className?: string;
}

export type DiffOp = 'eq' | 'add' | 'del';

export interface DiffLine {
  op: DiffOp;
  text: string;
  depth: number;
}

function stringify(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent) ?? String(value);
}

export function diffJson(left: unknown, right: unknown): DiffLine[] {
  const a = stringify(left).split('\n');
  const b = stringify(right).split('\n');
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: 'eq', text: a[i], depth: leadingSpaces(a[i]) });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: 'del', text: a[i], depth: leadingSpaces(a[i]) });
      i++;
    } else {
      out.push({ op: 'add', text: b[j], depth: leadingSpaces(b[j]) });
      j++;
    }
  }
  while (i < n) out.push({ op: 'del', text: a[i], depth: leadingSpaces(a[i++]) });
  while (j < m) out.push({ op: 'add', text: b[j], depth: leadingSpaces(b[j++]) });
  return out;
}

function leadingSpaces(s: string): number {
  let n = 0;
  while (n < s.length && s[n] === ' ') n++;
  return n;
}

export function jsonDiffClass(p: {
  size: JsonDiffSize;
  bordered: boolean;
  lineNumbers: boolean;
  className?: string;
}): string {
  return [
    'cf-jdiff',
    `cf-jdiff--${p.size}`,
    p.bordered && 'is-bordered',
    p.lineNumbers && 'has-numbers',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
