import type { TableColumn, TableSize } from '../table/variants';

export type DataGridSize = TableSize;

export interface DataGridColumn<T = Record<string, unknown>> extends TableColumn<T> {
  /** Allow user to drag-resize this column. */
  resizable?: boolean;
  minWidth?: number;
  /** Allow inline editing on double click. Triggers `cellEdit` event with new value. */
  editable?: boolean;
}

export interface DataGridCellEdit<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
  column: DataGridColumn<T>;
  value: string;
  previous: unknown;
}

export interface DataGridProps<T = Record<string, unknown>> {
  columns: DataGridColumn<T>[];
  rows: T[];
  rowKey?: string | ((row: T, index: number) => string);
  size?: DataGridSize;
  hoverable?: boolean;
  emptyText?: string;
  loading?: boolean;
  selectable?: 'single' | 'multiple';
  modelValue?: string | string[] | null;
  /** Max-height to enable vertical scroll while keeping header sticky. */
  maxHeight?: number | string;
}
