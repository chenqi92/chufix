export type PivotAggregator = 'sum' | 'avg' | 'count' | 'min' | 'max';
export type PivotSize = 'sm' | 'md' | 'lg';

export interface PivotProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Source row data. */
  data: T[];
  /** Field used to group rows. */
  rowField: keyof T & string;
  /** Field used to group columns. */
  colField: keyof T & string;
  /** Numeric field to aggregate (ignored when aggregator is 'count'). */
  valueField?: keyof T & string;
  /** How to aggregate values into each cell. Default 'sum'. */
  aggregator?: PivotAggregator;
  /** Custom cell formatter. */
  format?: (value: number, ctx: { row: string; col: string }) => string;
  /** Show grand-total row and column. Default true. */
  showTotals?: boolean;
  /** Optional caption above the table. */
  caption?: string;
  size?: PivotSize;
  /** Heatmap shading on cell values. Default false. */
  heatmap?: boolean;
  /** Highlight color for the heatmap (CSS color). Defaults to var(--accent-1). */
  heatmapColor?: string;
  /** Click on a cell. */
  onCellClick?: (cell: { row: string; col: string; value: number; rows: unknown[] }) => void;
}

export interface PivotResult {
  rowKeys: string[];
  colKeys: string[];
  /** rowKey -> colKey -> value. */
  cells: Record<string, Record<string, number | undefined>>;
  /** rowKey -> colKey -> raw rows. */
  raw: Record<string, Record<string, unknown[]>>;
  rowTotals: Record<string, number>;
  colTotals: Record<string, number>;
  grandTotal: number;
  min: number;
  max: number;
}

export function aggregate(values: number[], agg: PivotAggregator): number {
  if (agg === 'count') return values.length;
  if (!values.length) return 0;
  if (agg === 'sum') return values.reduce((a, b) => a + b, 0);
  if (agg === 'avg') return values.reduce((a, b) => a + b, 0) / values.length;
  if (agg === 'min') return Math.min(...values);
  if (agg === 'max') return Math.max(...values);
  return 0;
}

export function pivotCompute<T extends Record<string, unknown>>(
  data: T[],
  rowField: string,
  colField: string,
  valueField: string | undefined,
  aggregator: PivotAggregator,
): PivotResult {
  const rowKeys: string[] = [];
  const colKeys: string[] = [];
  const seenRow = new Set<string>();
  const seenCol = new Set<string>();
  const buckets: Record<string, Record<string, T[]>> = {};

  for (const row of data) {
    const r = String(row[rowField] ?? '—');
    const c = String(row[colField] ?? '—');
    if (!seenRow.has(r)) { seenRow.add(r); rowKeys.push(r); }
    if (!seenCol.has(c)) { seenCol.add(c); colKeys.push(c); }
    if (!buckets[r]) buckets[r] = {};
    if (!buckets[r][c]) buckets[r][c] = [];
    buckets[r][c].push(row);
  }

  const cells: Record<string, Record<string, number | undefined>> = {};
  const raw: Record<string, Record<string, unknown[]>> = {};
  let min = Infinity;
  let max = -Infinity;

  for (const r of rowKeys) {
    cells[r] = {};
    raw[r] = {};
    for (const c of colKeys) {
      const rows = buckets[r]?.[c];
      raw[r][c] = rows ?? [];
      if (!rows) {
        cells[r][c] = undefined;
        continue;
      }
      const values =
        aggregator === 'count'
          ? rows.map(() => 1)
          : (valueField ? rows.map((x) => Number(x[valueField] ?? 0)).filter((n) => !Number.isNaN(n)) : []);
      const v = aggregate(values, aggregator);
      cells[r][c] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  let grandTotal = 0;

  for (const r of rowKeys) {
    let sum = 0;
    for (const c of colKeys) {
      const v = cells[r][c];
      if (v !== undefined) sum += v;
    }
    rowTotals[r] = sum;
    grandTotal += sum;
  }
  for (const c of colKeys) {
    let sum = 0;
    for (const r of rowKeys) {
      const v = cells[r][c];
      if (v !== undefined) sum += v;
    }
    colTotals[c] = sum;
  }

  if (min === Infinity) min = 0;
  if (max === -Infinity) max = 0;

  return { rowKeys, colKeys, cells, raw, rowTotals, colTotals, grandTotal, min, max };
}
