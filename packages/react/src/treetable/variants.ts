import type { ReactNode } from 'react';

export interface TreeTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  accessor?: (row: T) => unknown;
  /** Custom cell renderer. */
  render?: (value: unknown, row: T, flat: FlatTreeRow<T>) => ReactNode;
}

export interface TreeTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TreeTableColumn<T>[];
  childrenKey?: string;
  defaultExpandedKeys?: string[];
  rowKey?: (row: T, path: number[]) => string;
  indentSize?: number;
  striped?: boolean;
  size?: 'sm' | 'md';
  onRowClick?: (row: T, flat: FlatTreeRow<T>) => void;
  onExpand?: (id: string, expanded: boolean) => void;
}

export interface FlatTreeRow<T> {
  id: string;
  row: T;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  path: number[];
}

export function flattenTree<T>(
  data: T[],
  childrenKey: string,
  expandedSet: Set<string>,
  rowKey: (row: T, path: number[]) => string,
): FlatTreeRow<T>[] {
  const out: FlatTreeRow<T>[] = [];
  function walk(rows: T[], depth: number, path: number[]) {
    rows.forEach((row, i) => {
      const childPath = [...path, i];
      const id = rowKey(row, childPath);
      const children = (row as unknown as Record<string, unknown>)[childrenKey] as T[] | undefined;
      const hasChildren = Array.isArray(children) && children.length > 0;
      const expanded = expandedSet.has(id);
      out.push({ id, row, depth, hasChildren, expanded, path: childPath });
      if (hasChildren && expanded) walk(children!, depth + 1, childPath);
    });
  }
  walk(data, 0, []);
  return out;
}

export function defaultRowKey<T>(_row: T, path: number[]): string {
  return path.join('.');
}
