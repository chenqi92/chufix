// ChuFix UI · Table 类型 + 工具
// 兼容旧 v0.1 API（columns / rows / 单列 sort / selectable）；新增能力全部以可选 prop 渐进开启。

export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'default' | 'bordered' | 'striped';
export type TableAlign = 'left' | 'center' | 'right';
export type SortDirection = 'asc' | 'desc' | null;

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export type TableFilterType = 'text' | 'select' | 'number-range' | 'date-range';

export interface TableFilterOption {
  label: string;
  value: string | number | boolean;
}

export interface TableColumn<T = Record<string, unknown>> {
  /** 唯一 key（必填）。也用于 sort / filter / 列状态识别。*/
  key: string;
  /** 表头展示文字。*/
  title?: string;
  /** 数据字段；缺省时回退到 key。*/
  dataIndex?: string;

  /* —— 几何 —— */
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: TableAlign;
  /** ellipsis: 文本溢出截断 + tooltip。*/
  ellipsis?: boolean;

  /* —— 排序 —— */
  sortable?: boolean;
  /** 自定义排序函数。返回负数 a 在前，正数 b 在前，零并列。*/
  sortFn?: (a: T, b: T) => number;

  /* —— 过滤 —— */
  filterable?: boolean;
  filterType?: TableFilterType;
  filterOptions?: TableFilterOption[];
  filterPlaceholder?: string;
  /** 自定义过滤函数。返回 true 保留该行。*/
  filterFn?: (filterValue: unknown, row: T, index: number) => boolean;

  /* —— 固定列 / 列状态 —— */
  fixed?: 'left' | 'right';
  resizable?: boolean;
  reorderable?: boolean;
  hideable?: boolean;
  /** 默认隐藏。*/
  hidden?: boolean;

  /* —— 渲染 —— */
  render?: (value: unknown, row: T, index: number) => unknown;
  format?: (value: unknown, row: T, index: number) => string;
  headerRender?: () => unknown;

  /* —— 多行表头 —— */
  children?: TableColumn<T>[];

  /* —— 总计行 —— */
  /** 'sum' / 'avg' / 'count' 自动聚合数字列；或传函数返回任意值。*/
  summary?: 'sum' | 'avg' | 'count' | ((rows: T[]) => unknown);
  summaryRender?: (value: unknown) => unknown;

  /* —— 杂项 —— */
  className?: string;
  cellClass?: string | ((row: T, index: number) => string);
}

export interface TablePagination {
  /** 当前页（1-indexed）。*/
  page: number;
  /** 每页条数。*/
  pageSize: number;
  /** 总条数。传了即视为服务端分页：组件不再做客户端 slice。*/
  total?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showJumper?: boolean;
  showTotal?: boolean;
}

export interface TableSummaryRow<T = Record<string, unknown>> {
  /** key -> 任意可渲染值（字符串 / VNode）。*/
  cells: Record<string, unknown>;
  className?: string;
}

export interface TableColumnsState {
  /** 隐藏的列 key 列表。*/
  hidden?: string[];
  /** 自定义顺序的 key 列表（包含全部可见列；不传则保持 columns 顺序）。*/
  order?: string[];
  /** 用户手动调整过的宽度，key -> px。*/
  widths?: Record<string, number>;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: string | ((row: T, index: number) => string);

  /* 视觉 */
  size?: TableSize;
  variant?: TableVariant;
  hoverable?: boolean;
  /** 表头粘性。开启时建议同时给 height。*/
  stickyHeader?: boolean;
  /** 表体最大高度，超出滚动。值为数字时单位 px。*/
  height?: number | string;

  /* 状态 */
  loading?: boolean;
  emptyText?: string;

  /* 排序：单列 = TableSort，多列 = TableSort[] + multiSort */
  sort?: TableSort | TableSort[] | null;
  defaultSort?: TableSort | TableSort[] | null;
  multiSort?: boolean;

  /* 过滤 */
  filters?: Record<string, unknown>;
  defaultFilters?: Record<string, unknown>;
  /** 全局搜索值。会跨 dataIndex 字段做大小写不敏感包含匹配。*/
  globalSearch?: string;
  defaultGlobalSearch?: string;
  /** 自定义全局搜索匹配函数。*/
  globalSearchFn?: (search: string, row: T, index: number) => boolean;

  /* 分页 */
  pagination?: TablePagination | false;
  defaultPagination?: TablePagination;

  /* 选择 */
  selectable?: 'single' | 'multiple';
  modelValue?: string | string[] | null;

  /* 行展开 */
  expandable?: boolean;
  expandRender?: (row: T, index: number) => unknown;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys?: string[];

  /* 树形数据：每行 row[childrenField] 是子行数组 */
  childrenField?: string;
  treeIndent?: number;

  /* 列状态：宽度 / 顺序 / 隐藏 */
  columnsState?: TableColumnsState;
  defaultColumnsState?: TableColumnsState;
  /** 全局开关，默认全部 columns 都视为 resizable=true。单列可在 column.resizable 覆盖。*/
  resizable?: boolean;
  reorderable?: boolean;

  /* 总计行 */
  /** 自动按 column.summary 计算并展示一行总计。*/
  showSummary?: boolean;
  /** 额外自定义总计行（在 auto summary 之后）。*/
  summary?: TableSummaryRow<T>[];

  /* 工具栏 */
  /** 'auto'：根据开启的能力自动展示 search / column-visibility 按钮。*/
  toolbar?: 'auto' | 'none';
}

/* ============================================================ */
/*                        辅助工具函数                           */
/* ============================================================ */

export function tableClass(p: {
  size: TableSize;
  variant: TableVariant;
  hoverable: boolean;
  loading: boolean;
  stickyHeader: boolean;
}): string {
  return [
    'cf-table',
    `cf-table--${p.size}`,
    `cf-table--${p.variant}`,
    p.hoverable && 'is-hoverable',
    p.loading && 'is-loading',
    p.stickyHeader && 'is-sticky-header',
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

/** 把 columns 拍成 leaf columns（最深一层），用于实际表体渲染。*/
export function flattenColumns<T = Record<string, unknown>>(
  cols: TableColumn<T>[],
): TableColumn<T>[] {
  const out: TableColumn<T>[] = [];
  for (const c of cols) {
    if (c.children?.length) out.push(...flattenColumns(c.children));
    else out.push(c);
  }
  return out;
}

/** 计算多行表头的网格：返回每行对应的 cell 与 colSpan / rowSpan。*/
export interface HeaderCell<T = Record<string, unknown>> {
  column: TableColumn<T>;
  rowSpan: number;
  colSpan: number;
  isLeaf: boolean;
}

export function computeHeaderRows<T = Record<string, unknown>>(
  cols: TableColumn<T>[],
): HeaderCell<T>[][] {
  const depth = (function get(arr: TableColumn<T>[]): number {
    let d = 1;
    for (const c of arr) {
      if (c.children?.length) d = Math.max(d, 1 + get(c.children));
    }
    return d;
  })(cols);

  const rows: HeaderCell<T>[][] = Array.from({ length: depth }, () => []);

  function leaves(arr: TableColumn<T>[]): number {
    let n = 0;
    for (const c of arr) n += c.children?.length ? leaves(c.children) : 1;
    return n;
  }

  function walk(arr: TableColumn<T>[], rowIdx: number) {
    for (const c of arr) {
      const isLeaf = !c.children?.length;
      const colSpan = isLeaf ? 1 : leaves(c.children!);
      const rowSpan = isLeaf ? depth - rowIdx : 1;
      rows[rowIdx].push({ column: c, colSpan, rowSpan, isLeaf });
      if (!isLeaf) walk(c.children!, rowIdx + 1);
    }
  }

  walk(cols, 0);
  return rows;
}

/** 数字列自动求和。非数字单元格被忽略。*/
export function aggregate<T = Record<string, unknown>>(
  rows: T[],
  col: TableColumn<T>,
): unknown {
  if (!col.summary) return undefined;
  if (typeof col.summary === 'function') return col.summary(rows);
  const values = rows
    .map((r) => getCellValue(r, col))
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (col.summary === 'count') return rows.length;
  if (col.summary === 'sum') return values.reduce((a, b) => a + b, 0);
  if (col.summary === 'avg') {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  return undefined;
}

/** 默认全局搜索：跨所有 leaf column 的 dataIndex 字段做包含匹配。*/
export function defaultGlobalSearchMatch<T = Record<string, unknown>>(
  search: string,
  row: T,
  cols: TableColumn<T>[],
): boolean {
  if (!search) return true;
  const q = search.toLowerCase();
  return cols.some((c) => {
    const v = getCellValue(row, c);
    if (v == null) return false;
    return String(v).toLowerCase().includes(q);
  });
}

/** 默认列过滤匹配。*/
export function defaultFilterMatch(filterValue: unknown, cellValue: unknown): boolean {
  if (filterValue == null || filterValue === '') return true;
  if (Array.isArray(filterValue)) {
    if (!filterValue.length) return true;
    return filterValue.some((v) => v === cellValue);
  }
  if (typeof filterValue === 'object' && filterValue !== null) {
    // number-range / date-range: { min?, max? }
    const r = filterValue as { min?: unknown; max?: unknown };
    const v = cellValue as number;
    if (typeof v !== 'number') return true;
    if (r.min != null && v < (r.min as number)) return false;
    if (r.max != null && v > (r.max as number)) return false;
    return true;
  }
  return String(cellValue ?? '').toLowerCase().includes(String(filterValue).toLowerCase());
}
