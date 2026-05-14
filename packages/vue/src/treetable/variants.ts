export interface TreeTableColumn<T = Record<string, unknown>> {
  key: string;
  /** Column header label. */
  label: string;
  /** Pixel or `%` width. */
  width?: number | string;
  /** Right-align (numeric columns). */
  align?: 'left' | 'center' | 'right';
  /** Custom getter; default reads row[col.key]. */
  accessor?: (row: T) => unknown;
}

export interface TreeTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TreeTableColumn<T>[];
  /** Key that holds the children array on each row. Default 'children'. */
  childrenKey?: string;
  /** Initial expanded row keys. Default []. */
  defaultExpandedKeys?: string[];
  /** Resolver for stable row id; default uses index path. */
  rowKey?: (row: T, path: number[]) => string;
  /** Indent per level (px). Default 16. */
  indentSize?: number;
  /** Show row striping. Default true. */
  striped?: boolean;
  /** Size preset. Default 'md'. */
  size?: 'sm' | 'md';
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
      if (hasChildren && expanded) {
        walk(children!, depth + 1, childPath);
      }
    });
  }
  walk(data, 0, []);
  return out;
}

export function defaultRowKey<T>(_row: T, path: number[]): string {
  return path.join('.');
}
