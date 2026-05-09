export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'default' | 'bordered' | 'striped';
export type TableAlign = 'left' | 'center' | 'right';
export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  align?: TableAlign;
  sortable?: boolean;
  fixed?: 'left' | 'right';
  format?: (value: unknown, row: T, index: number) => string;
  render?: (value: unknown, row: T, index: number) => unknown;
  headerRender?: () => unknown;
}

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: string | ((row: T, index: number) => string);
  size?: TableSize;
  variant?: TableVariant;
  hoverable?: boolean;
  emptyText?: string;
  loading?: boolean;
  /** Single sort state. Pass `defaultSort` for uncontrolled. */
  sort?: TableSort;
  defaultSort?: TableSort;
  selectable?: 'single' | 'multiple';
  modelValue?: string | string[] | null;
}

export function tableClass(p: {
  size: TableSize;
  variant: TableVariant;
  hoverable: boolean;
  loading: boolean;
}): string {
  return [
    'cf-table',
    `cf-table--${p.size}`,
    `cf-table--${p.variant}`,
    p.hoverable && 'is-hoverable',
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}

export function nextSortDirection(d: SortDirection): SortDirection {
  if (d === null) return 'asc';
  if (d === 'asc') return 'desc';
  return null;
}

export function compareCells(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function getRowKey<T = Record<string, unknown>>(
  row: T,
  index: number,
  rowKey?: string | ((row: T, index: number) => string),
): string {
  if (typeof rowKey === 'function') return rowKey(row, index);
  if (typeof rowKey === 'string') {
    return String((row as Record<string, unknown>)[rowKey] ?? index);
  }
  return String(index);
}

export function getCellValue<T = Record<string, unknown>>(
  row: T,
  col: TableColumn<T>,
): unknown {
  const key = col.dataIndex ?? col.key;
  return (row as Record<string, unknown>)[key];
}
