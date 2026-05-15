import type { ReactNode } from 'react';

export interface ReorderColumn<T> {
  key: string;
  label?: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
  render?: (row: T, index: number) => ReactNode;
}

export function gridTemplateForColumns<T>(
  columns: ReorderColumn<T>[],
  handleWidth = '36px',
): string {
  const cols = columns.map((c) => c.width ?? '1fr');
  return [handleWidth, ...cols].join(' ');
}
