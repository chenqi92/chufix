export type DiffEditorSize = 'sm' | 'md' | 'lg';
export type DiffEditorMode = 'split' | 'unified';

export interface DiffEditorProps {
  left: string;
  right: string;
  size?: DiffEditorSize;
  mode?: DiffEditorMode;
  showLineNumbers?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export type DiffOp = 'eq' | 'add' | 'del' | 'mod';

export interface DiffRow {
  op: DiffOp;
  leftLine?: number;
  leftText?: string;
  rightLine?: number;
  rightText?: string;
}

export function diffLines(left: string, right: string): DiffRow[] {
  const a = left.split('\n');
  const b = right.split('\n');
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      rows.push({
        op: 'eq',
        leftLine: i + 1,
        leftText: a[i],
        rightLine: j + 1,
        rightText: b[j],
      });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ op: 'del', leftLine: i + 1, leftText: a[i] });
      i++;
    } else {
      rows.push({ op: 'add', rightLine: j + 1, rightText: b[j] });
      j++;
    }
  }
  while (i < m) {
    rows.push({ op: 'del', leftLine: i + 1, leftText: a[i] });
    i++;
  }
  while (j < n) {
    rows.push({ op: 'add', rightLine: j + 1, rightText: b[j] });
    j++;
  }
  return rows;
}
