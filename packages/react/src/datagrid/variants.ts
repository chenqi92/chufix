import type { TableColumn, TableSize } from '../table/variants';

export type DataGridSize = TableSize;

export interface DataGridColumn<T = Record<string, unknown>> extends TableColumn<T> {
  resizable?: boolean;
  minWidth?: number;
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
  emptyText?: import('react').ReactNode;
  loading?: boolean;
  selectable?: 'single' | 'multiple';
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  maxHeight?: number | string;
  className?: string;
  onChange?: (value: string | string[] | null) => void;
  onCellEdit?: (edit: DataGridCellEdit<T>) => void;
  onColumnResize?: (col: DataGridColumn<T>, width: number) => void;
}
