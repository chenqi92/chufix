export type SpreadsheetSize = 'sm' | 'md' | 'lg';

export interface SpreadsheetProps {
  /** Number of rows. Default 20. */
  rows?: number;
  /** Number of columns. Default 10. */
  cols?: number;
  /** Data keyed by A1 notation: { 'A1': '12', 'B2': 'hello' }. */
  modelValue?: Record<string, string>;
  /** Pixel width of each column. Default 120. */
  colWidth?: number;
  /** Pixel height of each row. Default 28. */
  rowHeight?: number;
  /** Pixel width of the row-number header column. Default 44. */
  rowHeaderWidth?: number;
  /** Read-only — cells cannot be edited. */
  readonly?: boolean;
  /** Disable copy/paste integration with the clipboard. */
  disableClipboard?: boolean;
  /** Optional caption above the sheet. */
  caption?: string;
  size?: SpreadsheetSize;
}

/** Convert (col, row) 0-indexed to A1 notation. */
export function toA1(col: number, row: number): string {
  return colLetter(col) + (row + 1);
}

/** 0 → A, 1 → B, 25 → Z, 26 → AA, etc. */
export function colLetter(col: number): string {
  let s = '';
  let n = col;
  while (true) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    if (n < 26) break;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

export interface CellPos { col: number; row: number; }
export interface CellRange { start: CellPos; end: CellPos; }

export function normalizeRange(r: CellRange): CellRange {
  return {
    start: {
      col: Math.min(r.start.col, r.end.col),
      row: Math.min(r.start.row, r.end.row),
    },
    end: {
      col: Math.max(r.start.col, r.end.col),
      row: Math.max(r.start.row, r.end.row),
    },
  };
}

export function rangeToTSV(
  data: Record<string, string>,
  range: CellRange,
): string {
  const r = normalizeRange(range);
  const lines: string[] = [];
  for (let row = r.start.row; row <= r.end.row; row++) {
    const cells: string[] = [];
    for (let col = r.start.col; col <= r.end.col; col++) {
      cells.push(data[toA1(col, row)] ?? '');
    }
    lines.push(cells.join('\t'));
  }
  return lines.join('\n');
}

export function tsvToData(
  tsv: string,
  start: CellPos,
  bounds: { cols: number; rows: number },
): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = tsv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  for (let r = 0; r < lines.length; r++) {
    const cells = lines[r].split('\t');
    for (let c = 0; c < cells.length; c++) {
      const col = start.col + c;
      const row = start.row + r;
      if (col >= bounds.cols || row >= bounds.rows) continue;
      out[toA1(col, row)] = cells[c];
    }
  }
  return out;
}
