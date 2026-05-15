import type { VNode } from 'vue';

export interface ReorderTableReorderEvent<T = unknown> {
  from: number;
  to: number;
  rows: T[];
}

export interface ReorderColumn<T> {
  key: string;
  label?: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
  render?: (row: T, index: number) => VNode | string | number | null;
}

export function gridTemplateForColumns<T>(
  columns: ReorderColumn<T>[],
  handleWidth = '32px',
): string {
  const cols = columns.map((c) => c.width ?? '1fr');
  return [handleWidth, ...cols].join(' ');
}
