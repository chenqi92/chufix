<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * ChuFix UI · Table
 *
 * 设计取舍：
 * - 客户端默认开启所有派生（filter / sort / paginate）；服务端模式下传 `pagination.total`，
 *   组件就把 sort / filter / pagination 透传给业务方，自身只负责渲染。
 * - 列状态（顺序 / 隐藏 / 宽度）走非受控为主：组件持有 internalState，必要时通过
 *   `update:columnsState` 暴露给上层。也可全受控传入 `columnsState`。
 * - 不依赖任何第三方拖拽 / 虚拟滚动库。HTML5 DnD 处理列拖拽；指针事件处理 resize。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  aggregate,
  arrayMove,
  compareCells,
  computeHeaderRows,
  defaultFilterMatch,
  defaultGlobalSearchMatch,
  downloadCsv,
  flattenColumns,
  getCellValue,
  getRowKey,
  moveTreeRow,
  nextSortDirection,
  normalizeFixedOrder,
  parseClipboardGrid,
  rowsToCsv,
  tableClass,
  type SortDirection,
  type TableColumn,
  type TableColumnsState,
  type TableEditType,
  type TablePagination,
  type TableProps,
  type TableSort,
  type TableSummaryRow,
  type TreeDropPos,
} from './variants';

const props = withDefaults(defineProps<TableProps<T>>(), {
  size: 'md',
  variant: 'default',
  hoverable: true,
  emptyText: '暂无数据',
  loading: false,
  modelValue: null,
  stickyHeader: false,
  multiSort: false,
  childrenField: 'children',
  treeIndent: 16,
  resizable: false,
  reorderable: false,
  showSummary: false,
  toolbar: 'none',
  virtual: false,
  rowHeight: 36,
  overscan: 6,
  rowReorderable: false,
  exportable: false,
  exportFileName: 'table',
  serverDebounce: 0,
  cellSelectable: false,
  cellPastable: false,
  colVirtual: false,
  colWidth: 120,
  colOverscan: 4,
  treeReorderable: false,
  historyEnabled: false,
  historyDepth: 50,
});

const emit = defineEmits<{
  (e: 'update:sort', sort: TableSort | TableSort[] | null): void;
  (e: 'sort-change', sort: TableSort | TableSort[] | null): void;
  (e: 'update:filters', filters: Record<string, unknown>): void;
  (e: 'update:globalSearch', value: string): void;
  (e: 'update:pagination', value: TablePagination): void;
  (e: 'update:modelValue', value: string | string[] | null): void;
  (e: 'update:columnsState', value: TableColumnsState): void;
  (e: 'update:expandedRowKeys', value: string[]): void;
  (e: 'update:rows', value: T[]): void;
  (e: 'row-click', row: T, index: number): void;
  (e: 'cell-edit', payload: { row: T; column: TableColumn<T>; oldValue: unknown; newValue: unknown; index: number }): void;
  (e: 'row-reorder', payload: { from: number; to: number; rows: T[] }): void;
  (e: 'tree-reorder', payload: { fromKey: string; toKey: string; pos: TreeDropPos; rows: T[] }): void;
  (e: 'cell-paste', payload: { applied: number; skipped: number }): void;
  (e: 'export', csv: string): void;
  (e: 'history-change', payload: { canUndo: boolean; canRedo: boolean }): void;
}>();

/* ============================================================ */
/*                       内部受控状态                            */
/* ============================================================ */

// sort
const internalSort = ref<TableSort | TableSort[] | null>(props.defaultSort ?? null);
watch(
  () => props.defaultSort,
  (v) => {
    if (props.sort === undefined) internalSort.value = v ?? null;
  },
);
const activeSort = computed(() =>
  props.sort !== undefined ? (props.sort ?? null) : internalSort.value,
);
const sortList = computed<TableSort[]>(() => {
  const s = activeSort.value;
  if (!s) return [];
  return Array.isArray(s) ? s.filter((x) => x.direction) : s.direction ? [s] : [];
});

// filters
const internalFilters = ref<Record<string, unknown>>({ ...(props.defaultFilters ?? {}) });
watch(
  () => props.defaultFilters,
  (v) => {
    if (props.filters === undefined) internalFilters.value = { ...(v ?? {}) };
  },
);
const activeFilters = computed(() =>
  props.filters !== undefined ? props.filters : internalFilters.value,
);

// global search
const internalSearch = ref<string>(props.defaultGlobalSearch ?? '');
watch(
  () => props.defaultGlobalSearch,
  (v) => {
    if (props.globalSearch === undefined) internalSearch.value = v ?? '';
  },
);
const activeSearch = computed(() =>
  props.globalSearch !== undefined ? props.globalSearch : internalSearch.value,
);

// pagination
const internalPagination = ref<TablePagination | null>(
  props.defaultPagination ?? (props.pagination !== false ? null : null),
);
watch(
  () => props.defaultPagination,
  (v) => {
    if (props.pagination === undefined) internalPagination.value = v ?? null;
  },
);
const activePagination = computed<TablePagination | null>(() => {
  if (props.pagination === false) return null;
  if (props.pagination !== undefined) return props.pagination ?? null;
  return internalPagination.value;
});

// expanded rows
const internalExpanded = ref<string[]>(props.defaultExpandedRowKeys ?? []);
watch(
  () => props.defaultExpandedRowKeys,
  (v) => {
    if (props.expandedRowKeys === undefined) internalExpanded.value = v ?? [];
  },
);
const expandedSet = computed(() => {
  const arr = props.expandedRowKeys !== undefined ? props.expandedRowKeys : internalExpanded.value;
  return new Set(arr);
});

// columns state
const internalColumnsState = ref<TableColumnsState>(
  props.defaultColumnsState ?? {
    hidden: props.columns.filter((c) => c.hidden).map((c) => c.key),
    order: undefined,
    widths: {},
  },
);
watch(
  () => props.defaultColumnsState,
  (v) => {
    if (props.columnsState === undefined) {
      internalColumnsState.value = v ?? { hidden: [], order: undefined, widths: {} };
    }
  },
);
const activeColumnsState = computed<TableColumnsState>(() =>
  props.columnsState !== undefined ? props.columnsState : internalColumnsState.value,
);

function patchColumnsState(patch: Partial<TableColumnsState>) {
  const next = {
    ...activeColumnsState.value,
    ...patch,
    hidden: patch.hidden ?? activeColumnsState.value.hidden ?? [],
    widths: { ...(activeColumnsState.value.widths ?? {}), ...(patch.widths ?? {}) },
  };
  // 自动把 fixed 列归位到首 / 尾
  if (patch.order !== undefined) {
    const all = flattenColumns(props.columns);
    next.order = normalizeFixedOrder(patch.order, all);
  }
  if (props.columnsState === undefined) internalColumnsState.value = next;
  emit('update:columnsState', next);
}

/* ============================================================ */
/*                  派生 leafColumns / 排序后顺序                */
/* ============================================================ */

const allLeafColumns = computed(() => flattenColumns(props.columns));

/** 应用 hidden / order / widths 后用于渲染的 leaf 列。*/
const renderLeafColumns = computed<TableColumn<T>[]>(() => {
  const state = activeColumnsState.value;
  const hidden = new Set(state.hidden ?? []);
  const widths = state.widths ?? {};
  const all = allLeafColumns.value.filter((c) => !hidden.has(c.key));

  let ordered: TableColumn<T>[] = all;
  if (state.order?.length) {
    const idx = new Map(state.order.map((k, i) => [k, i]));
    ordered = [...all].sort(
      (a, b) => (idx.get(a.key) ?? Infinity) - (idx.get(b.key) ?? Infinity),
    );
  }

  return ordered.map((c) => (widths[c.key] != null ? { ...c, width: widths[c.key] } : c));
});

const headerRows = computed(() => {
  // 用未排序/隐藏过滤的原始 columns 计算多行表头；隐藏列只把 leaf 干掉
  // 简化：当用户使用 hide / reorder 时，多行表头自动退化为单行
  const hidden = new Set(activeColumnsState.value.hidden ?? []);
  const hasOrder = !!activeColumnsState.value.order?.length;
  const anyHidden = (activeColumnsState.value.hidden ?? []).length > 0;
  if (anyHidden || hasOrder) {
    return [
      renderLeafColumns.value.map((c) => ({
        column: c,
        colSpan: 1,
        rowSpan: 1,
        isLeaf: true,
      })),
    ];
  }
  return computeHeaderRows(props.columns).map((row) =>
    row.map((cell) =>
      cell.isLeaf && hidden.has(cell.column.key) ? null : cell,
    ).filter((x): x is NonNullable<typeof x> => x !== null),
  );
});

/* ============================================================ */
/*                     树形数据展开成扁平行                      */
/* ============================================================ */

interface FlatRow {
  row: T;
  key: string;
  level: number;
  index: number;
  /** 父行 key（顶层为 null）。*/
  parentKey: string | null;
  hasChildren: boolean;
}

function flattenTreeRows(rows: T[]): FlatRow[] {
  const out: FlatRow[] = [];
  let nextIndex = 0;
  function walk(arr: T[], level: number, parentKey: string | null) {
    for (const r of arr) {
      const k = getRowKey(r, nextIndex, props.rowKey);
      const children = (r as Record<string, unknown>)[props.childrenField!] as T[] | undefined;
      const hasChildren = !!children?.length;
      out.push({ row: r, key: k, level, index: nextIndex++, parentKey, hasChildren });
      if (hasChildren && expandedSet.value.has(k)) {
        walk(children!, level + 1, k);
      }
    }
  }
  walk(rows, 0, null);
  return out;
}

/* ============================================================ */
/*                  filter -> sort -> paginate                   */
/* ============================================================ */

const filteredRows = computed<T[]>(() => {
  let arr = props.rows;
  // 全局搜索
  const search = activeSearch.value;
  if (search) {
    const fn = props.globalSearchFn;
    arr = arr.filter((r, i) =>
      fn ? fn(search, r, i) : defaultGlobalSearchMatch(search, r, allLeafColumns.value),
    );
  }
  // 列过滤
  const filters = activeFilters.value;
  for (const col of allLeafColumns.value) {
    const fv = filters[col.key];
    if (fv == null || fv === '' || (Array.isArray(fv) && fv.length === 0)) continue;
    if (col.filterFn) {
      arr = arr.filter((r, i) => col.filterFn!(fv, r, i));
    } else {
      arr = arr.filter((r) => defaultFilterMatch(fv, getCellValue(r, col)));
    }
  }
  return arr;
});

const sortedRows = computed<T[]>(() => {
  const list = sortList.value;
  if (!list.length) return filteredRows.value;
  const colByKey = new Map(allLeafColumns.value.map((c) => [c.key, c]));
  return [...filteredRows.value].sort((a, b) => {
    for (const s of list) {
      const col = colByKey.get(s.key);
      if (!col) continue;
      const sign = s.direction === 'desc' ? -1 : 1;
      const cmp = col.sortFn
        ? col.sortFn(a, b)
        : compareCells(getCellValue(a, col), getCellValue(b, col));
      if (cmp !== 0) return sign * cmp;
    }
    return 0;
  });
});

const isServerPagination = computed(
  () => activePagination.value?.total != null,
);
const paginatedRows = computed<T[]>(() => {
  const p = activePagination.value;
  if (!p || isServerPagination.value) return sortedRows.value;
  const start = (p.page - 1) * p.pageSize;
  return sortedRows.value.slice(start, start + p.pageSize);
});

const visibleRows = computed<T[]>(() => paginatedRows.value);

const flatTreeRows = computed<FlatRow[]>(() => flattenTreeRows(visibleRows.value));

/* ============================================================ */
/*                    行选择                                      */
/* ============================================================ */

const selectedSet = computed(() => {
  if (props.selectable === 'multiple') {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : [];
    return new Set(arr);
  }
  if (props.selectable === 'single') {
    return new Set(props.modelValue ? [props.modelValue as string] : []);
  }
  return new Set<string>();
});

const allSelected = computed(() => {
  if (props.selectable !== 'multiple') return false;
  if (!flatTreeRows.value.length) return false;
  return flatTreeRows.value.every((r) => selectedSet.value.has(r.key));
});
const someSelected = computed(() => !allSelected.value && selectedSet.value.size > 0);

function toggleRow(key: string) {
  if (props.selectable === 'single') {
    emit('update:modelValue', selectedSet.value.has(key) ? null : key);
    return;
  }
  if (props.selectable !== 'multiple') return;
  const next = new Set(selectedSet.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  emit('update:modelValue', Array.from(next));
}

function toggleAll() {
  if (props.selectable !== 'multiple') return;
  if (allSelected.value) {
    emit('update:modelValue', []);
  } else {
    emit('update:modelValue', flatTreeRows.value.map((r) => r.key));
  }
}

/* ============================================================ */
/*                     行点击 / 行展开                           */
/* ============================================================ */

function onRowClick(row: T, i: number) {
  emit('row-click', row, i);
}

function setExpanded(next: string[]) {
  if (props.expandedRowKeys === undefined) internalExpanded.value = next;
  emit('update:expandedRowKeys', next);
}

function toggleExpand(key: string) {
  const cur = expandedSet.value;
  const next = cur.has(key)
    ? Array.from(cur).filter((k) => k !== key)
    : [...Array.from(cur), key];
  setExpanded(next);
}

/* ============================================================ */
/*                     排序点击                                   */
/* ============================================================ */

function onSort(col: TableColumn<T>, ev: MouseEvent) {
  if (!col.sortable) return;
  const list = sortList.value;
  const idx = list.findIndex((s) => s.key === col.key);

  if (props.multiSort && (ev.shiftKey || ev.metaKey)) {
    let next: TableSort[];
    if (idx === -1) {
      next = [...list, { key: col.key, direction: 'asc' }];
    } else {
      const dir = nextSortDirection(list[idx].direction);
      next = [...list];
      if (dir) next[idx] = { key: col.key, direction: dir };
      else next.splice(idx, 1);
    }
    if (props.sort === undefined) internalSort.value = next;
    emit('update:sort', next);
    emit('sort-change', next);
    return;
  }

  // 单列模式：替换
  let next: TableSort | null;
  if (idx !== -1) {
    const dir = nextSortDirection(list[idx].direction);
    next = dir ? { key: col.key, direction: dir } : null;
  } else {
    next = { key: col.key, direction: 'asc' };
  }
  if (props.sort === undefined) internalSort.value = next;
  emit('update:sort', next);
  emit('sort-change', next);
}

function sortDirOf(key: string): SortDirection {
  return sortList.value.find((s) => s.key === key)?.direction ?? null;
}

function sortIndexOf(key: string): number {
  const i = sortList.value.findIndex((s) => s.key === key);
  return i === -1 ? -1 : i + 1;
}

/* ============================================================ */
/*                   列过滤 (内置弹层)                            */
/* ============================================================ */

const openFilterKey = ref<string | null>(null);

function setFilterValue(key: string, value: unknown) {
  const next = { ...activeFilters.value, [key]: value };
  if (value == null || value === '' || (Array.isArray(value) && !value.length)) {
    delete next[key];
  }
  if (props.filters === undefined) internalFilters.value = next;
  emitFilters(next);
  // 过滤后重置到第 1 页
  const p = activePagination.value;
  if (p && !isServerPagination.value && p.page !== 1) {
    setPagination({ ...p, page: 1 });
  }
}

function numberRangeFilter(key: string): { min?: number; max?: number } {
  const value = activeFilters.value[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as { min?: number; max?: number })
    : {};
}

function setNumberRangeFilter(key: string, field: 'min' | 'max', raw: string) {
  setFilterValue(key, {
    ...numberRangeFilter(key),
    [field]: raw === '' ? undefined : Number(raw),
  });
}

/* ============================================================ */
/*                       全局搜索                                 */
/* ============================================================ */

function setGlobalSearch(v: string) {
  if (props.globalSearch === undefined) internalSearch.value = v;
  emitGlobalSearch(v);
  const p = activePagination.value;
  if (p && !isServerPagination.value && p.page !== 1) {
    setPagination({ ...p, page: 1 });
  }
}

/* ============================================================ */
/*                       分页                                     */
/* ============================================================ */

function setPagination(next: TablePagination) {
  if (props.pagination === undefined) internalPagination.value = next;
  emit('update:pagination', next);
}

const pageCount = computed(() => {
  const p = activePagination.value;
  if (!p) return 1;
  const total = p.total ?? sortedRows.value.length;
  return Math.max(1, Math.ceil(total / p.pageSize));
});
const totalCount = computed(() => {
  const p = activePagination.value;
  if (!p) return sortedRows.value.length;
  return p.total ?? sortedRows.value.length;
});

function gotoPage(page: number) {
  const p = activePagination.value;
  if (!p) return;
  const next = Math.max(1, Math.min(pageCount.value, page));
  if (next !== p.page) setPagination({ ...p, page: next });
}
function changePageSize(size: number) {
  const p = activePagination.value;
  if (!p) return;
  setPagination({ ...p, pageSize: size, page: 1 });
}

/* ============================================================ */
/*                       列拖拽（reorder）                        */
/* ============================================================ */

const dragKey = ref<string | null>(null);
const dragOverKey = ref<string | null>(null);

function onDragStart(ev: DragEvent, key: string) {
  if (!isReorderable(key)) return;
  dragKey.value = key;
  ev.dataTransfer?.setData('text/plain', key);
  if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
}
function onDragOver(ev: DragEvent, key: string) {
  if (!dragKey.value || dragKey.value === key) return;
  ev.preventDefault();
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
  if (dragOverKey.value !== key) dragOverKey.value = key;
}
function onDrop(ev: DragEvent, key: string) {
  ev.preventDefault();
  const from = dragKey.value;
  if (!from || from === key) {
    dragKey.value = null;
    dragOverKey.value = null;
    return;
  }
  const order = renderLeafColumns.value.map((c) => c.key);
  const fromIdx = order.indexOf(from);
  const toIdx = order.indexOf(key);
  if (fromIdx === -1 || toIdx === -1) return;
  const [moved] = order.splice(fromIdx, 1);
  order.splice(toIdx, 0, moved);
  patchColumnsState({ order });
  dragKey.value = null;
  dragOverKey.value = null;
}

function isReorderable(key: string): boolean {
  if (!props.reorderable) return false;
  const c = allLeafColumns.value.find((x) => x.key === key);
  return !!c && c.reorderable !== false && !c.fixed;
}

/* ============================================================ */
/*                       列拖拽（resize）                         */
/* ============================================================ */

interface ResizeState { key: string; startX: number; startWidth: number; }
const resize = ref<ResizeState | null>(null);

function startResize(ev: PointerEvent, col: TableColumn<T>, currentWidth: number) {
  if (!isResizable(col)) return;
  ev.preventDefault();
  resize.value = { key: col.key, startX: ev.clientX, startWidth: currentWidth };
  (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
}
function moveResize(ev: PointerEvent, col: TableColumn<T>) {
  const r = resize.value;
  if (!r || r.key !== col.key) return;
  const dx = ev.clientX - r.startX;
  const min = col.minWidth ?? 60;
  const max = col.maxWidth ?? 9999;
  const next = Math.max(min, Math.min(max, r.startWidth + dx));
  patchColumnsState({ widths: { [col.key]: next } });
}
function endResize() {
  resize.value = null;
}
function isResizable(col: TableColumn<T>): boolean {
  if (col.resizable === false) return false;
  return !!props.resizable || col.resizable === true;
}

/* ============================================================ */
/*                       固定列偏移计算                          */
/* ============================================================ */

interface FixedOffset { left?: number; right?: number; }
const fixedOffsets = computed<Record<string, FixedOffset>>(() => {
  const out: Record<string, FixedOffset> = {};
  let lo = 0;
  for (const c of renderLeafColumns.value) {
    if (c.fixed === 'left') {
      out[c.key] = { left: lo };
      lo += widthOf(c) ?? 120;
    }
  }
  let ro = 0;
  for (let i = renderLeafColumns.value.length - 1; i >= 0; i--) {
    const c = renderLeafColumns.value[i];
    if (c.fixed === 'right') {
      out[c.key] = { right: ro };
      ro += widthOf(c) ?? 120;
    }
  }
  return out;
});

function widthOf(c: TableColumn<T>): number | undefined {
  if (typeof c.width === 'number') return c.width;
  if (typeof c.width === 'string' && c.width.endsWith('px')) {
    const n = parseFloat(c.width);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/* ============================================================ */
/*                       列可见性下拉                            */
/* ============================================================ */

const colMenuOpen = ref(false);
function toggleColumnHidden(key: string) {
  const cur = new Set(activeColumnsState.value.hidden ?? []);
  if (cur.has(key)) cur.delete(key);
  else cur.add(key);
  patchColumnsState({ hidden: Array.from(cur) });
}
const hideableColumns = computed(() =>
  allLeafColumns.value.filter((c) => c.hideable !== false),
);
const hiddenSet = computed(() => new Set(activeColumnsState.value.hidden ?? []));

/* ============================================================ */
/*                       自动总计行                              */
/* ============================================================ */

const autoSummaryRow = computed<TableSummaryRow<T> | null>(() => {
  if (!props.showSummary) return null;
  const cells: Record<string, unknown> = {};
  for (const c of renderLeafColumns.value) {
    if (!c.summary) continue;
    cells[c.key] = aggregate(filteredRows.value, c);
  }
  return Object.keys(cells).length ? { cells, className: 'cf-table__summary-row--auto' } : null;
});
const summaryRows = computed<TableSummaryRow<T>[]>(() => {
  const list: TableSummaryRow<T>[] = [];
  if (autoSummaryRow.value) list.push(autoSummaryRow.value);
  if (props.summary) list.push(...props.summary);
  return list;
});

/* ============================================================ */
/*                          视觉 class                            */
/* ============================================================ */

const cls = computed(() =>
  tableClass({
    size: props.size,
    variant: props.variant,
    hoverable: props.hoverable,
    loading: props.loading,
    stickyHeader: props.stickyHeader,
  }),
);

const scrollStyle = computed(() => {
  const h = props.height;
  if (h == null) return undefined;
  return { maxHeight: typeof h === 'number' ? `${h}px` : h };
});

function alignClass(col: TableColumn<T>) {
  return col.align ? `cf-table__cell--${col.align}` : '';
}

function fixedClass(col: TableColumn<T>) {
  if (!col.fixed) return '';
  return `cf-table__cell--fixed cf-table__cell--fixed-${col.fixed}`;
}

function fixedStyle(col: TableColumn<T>): Record<string, string> | undefined {
  const o = fixedOffsets.value[col.key];
  if (!o) return undefined;
  if (o.left != null) return { left: `${o.left}px` };
  if (o.right != null) return { right: `${o.right}px` };
  return undefined;
}

function colStyle(col: TableColumn<T>) {
  return col.width != null
    ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
    : undefined;
}

function cellOf(row: T, col: TableColumn<T>, index: number): unknown {
  const v = getCellValue(row, col);
  if (col.format) return col.format(v, row, index);
  return v;
}
function cellClassOf(row: T, col: TableColumn<T>, index: number): string {
  if (typeof col.cellClass === 'function') return col.cellClass(row, index);
  return col.cellClass ?? '';
}

/* ============================================================ */
/*                        总计行渲染                              */
/* ============================================================ */

function summaryCellOf(srow: TableSummaryRow<T>, col: TableColumn<T>): unknown {
  const v = srow.cells[col.key];
  if (v === undefined) return '';
  if (col.summaryRender) return col.summaryRender(v);
  if (typeof v === 'number') return Number.isInteger(v) ? v : v.toFixed(2);
  return v;
}

/* ============================================================ */
/*                        工具栏可见性                            */
/* ============================================================ */

const showToolbar = computed(() => {
  if (props.toolbar === 'none') return false;
  // 'auto'：开启了 search / hide / export / 任意一个相关能力时显示
  return (
    props.globalSearch !== undefined ||
    props.defaultGlobalSearch !== undefined ||
    !!props.globalSearchFn ||
    hideableColumns.value.length > 0 ||
    props.exportable === true
  );
});

/* ============================================================ */
/*                        虚拟滚动                                 */
/* ============================================================ */

const scrollEl = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const viewportHeight = ref(0);

function onScroll(ev: Event) {
  const el = ev.target as HTMLElement;
  scrollTop.value = el.scrollTop;
}

let resizeObs: ResizeObserver | null = null;
onMounted(() => {
  if (!scrollEl.value) return;
  viewportHeight.value = scrollEl.value.clientHeight;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObs = new ResizeObserver(() => {
      if (scrollEl.value) viewportHeight.value = scrollEl.value.clientHeight;
    });
    resizeObs.observe(scrollEl.value);
  }
});
onBeforeUnmount(() => {
  resizeObs?.disconnect();
  resizeObs = null;
});

const virtualWindow = computed(() => {
  if (!props.virtual) {
    return { start: 0, end: flatTreeRows.value.length, padTop: 0, padBottom: 0 };
  }
  const total = flatTreeRows.value.length;
  const rh = props.rowHeight ?? 36;
  const overscan = props.overscan ?? 6;
  const visible = Math.ceil((viewportHeight.value || 400) / rh) + 1;
  const start = Math.max(0, Math.floor(scrollTop.value / rh) - overscan);
  const end = Math.min(total, start + visible + overscan * 2);
  return {
    start,
    end,
    padTop: start * rh,
    padBottom: Math.max(0, (total - end) * rh),
  };
});

const visibleFlatRows = computed(() => {
  const { start, end } = virtualWindow.value;
  if (!props.virtual) return flatTreeRows.value;
  return flatTreeRows.value.slice(start, end);
});

/* ============================================================ */
/*                        行拖拽换序                              */
/* ============================================================ */

const rowDragKey = ref<string | null>(null);
const rowDragOverKey = ref<string | null>(null);
const rowDropPos = ref<TreeDropPos>('below');

function onRowDragStart(ev: DragEvent, key: string) {
  if (!props.rowReorderable) return;
  rowDragKey.value = key;
  ev.dataTransfer?.setData('text/plain', key);
  if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
}

function computeDropPos(ev: DragEvent, target: HTMLElement): TreeDropPos {
  const rect = target.getBoundingClientRect();
  const y = ev.clientY - rect.top;
  const ratio = y / rect.height;
  if (props.treeReorderable && ratio >= 0.25 && ratio <= 0.75) return 'inside';
  return ratio < 0.5 ? 'above' : 'below';
}

function onRowDragOver(ev: DragEvent, key: string) {
  if (!rowDragKey.value || rowDragKey.value === key) return;
  ev.preventDefault();
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
  if (rowDragOverKey.value !== key) rowDragOverKey.value = key;
  const target = ev.currentTarget as HTMLElement;
  rowDropPos.value = computeDropPos(ev, target);
}

function onRowDrop(ev: DragEvent, key: string) {
  ev.preventDefault();
  const from = rowDragKey.value;
  const pos = rowDropPos.value;
  rowDragKey.value = null;
  rowDragOverKey.value = null;
  if (!from || from === key) return;

  if (props.treeReorderable) {
    const [next, ok] = moveTreeRow(
      props.rows,
      from,
      key,
      pos,
      (r, i) => getRowKey(r, i, props.rowKey),
      props.childrenField ?? 'children',
    );
    if (ok) {
      emit('update:rows', next);
      emit('tree-reorder', { fromKey: from, toKey: key, pos, rows: next });
    }
    return;
  }

  // 顶层 only：保留旧行为
  const fromIdx = props.rows.findIndex((r, i) => getRowKey(r, i, props.rowKey) === from);
  const toIdx = props.rows.findIndex((r, i) => getRowKey(r, i, props.rowKey) === key);
  if (fromIdx === -1 || toIdx === -1) return;
  const next = arrayMove(props.rows, fromIdx, toIdx);
  emit('update:rows', next);
  emit('row-reorder', { from: fromIdx, to: toIdx, rows: next });
}

/* ============================================================ */
/*                        内联编辑                                */
/* ============================================================ */

interface EditingCell {
  rowKey: string;
  colKey: string;
  draft: unknown;
}
const editing = ref<EditingCell | null>(null);
const editInputRef = ref<HTMLInputElement | HTMLSelectElement | null>(null);

function isCellEditable(row: T, col: TableColumn<T>, index: number): boolean {
  const e = col.editable;
  if (!e) return false;
  if (typeof e === 'function') return e(row, index);
  return true;
}
function beginEdit(row: T, col: TableColumn<T>, index: number, key: string) {
  if (!isCellEditable(row, col, index)) return;
  editing.value = {
    rowKey: key,
    colKey: col.key,
    draft: getCellValue(row, col),
  };
  nextTick(() => editInputRef.value?.focus());
}
function commitEdit(row: T, col: TableColumn<T>, index: number) {
  const ed = editing.value;
  if (!ed) return;
  const oldValue = getCellValue(row, col);
  let newValue: unknown = ed.draft;
  if (col.editType === 'number') {
    newValue = newValue === '' || newValue == null ? null : Number(newValue);
  }
  if (col.editValidate && col.editValidate(newValue, row, index) === false) {
    return; // 校验失败：保持编辑态
  }
  editing.value = null;
  if (newValue !== oldValue) {
    emit('cell-edit', { row, column: col, oldValue, newValue, index });
  }
}
function cancelEdit() {
  editing.value = null;
}
function onEditKeydown(ev: KeyboardEvent, row: T, col: TableColumn<T>, index: number) {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    commitEdit(row, col, index);
  } else if (ev.key === 'Escape') {
    ev.preventDefault();
    cancelEdit();
  }
}

/* ============================================================ */
/*                        CSV 导出                                */
/* ============================================================ */

function doExport() {
  // 导出过滤后的当前数据，但用最初的 columns 保留隐藏列也想要的话；这里走 renderLeafColumns
  const csv = rowsToCsv(filteredRows.value, renderLeafColumns.value as TableColumn<T>[]);
  emit('export', csv);
  downloadCsv(csv, props.exportFileName ?? 'table');
}

/* ============================================================ */
/*               列状态持久化（localStorage）                    */
/* ============================================================ */

const STORAGE_PREFIX = 'cf-table:';
onMounted(() => {
  if (!props.persistKey || typeof localStorage === 'undefined') return;
  if (props.columnsState !== undefined) return; // 受控时不读
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + props.persistKey);
    if (raw) internalColumnsState.value = JSON.parse(raw);
  } catch {}
});
watch(
  () => activeColumnsState.value,
  (v) => {
    if (!props.persistKey || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PREFIX + props.persistKey, JSON.stringify(v));
    } catch {}
  },
  { deep: true },
);

/* ============================================================ */
/*                  服务端模式防抖（search/filter）              */
/* ============================================================ */

let searchDebounce: number | null = null;
let filterDebounce: number | null = null;

function emitGlobalSearch(v: string) {
  if (!props.serverDebounce) {
    emit('update:globalSearch', v);
    return;
  }
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = window.setTimeout(() => {
    emit('update:globalSearch', v);
    searchDebounce = null;
  }, props.serverDebounce);
}
function emitFilters(next: Record<string, unknown>) {
  if (!props.serverDebounce) {
    emit('update:filters', next);
    return;
  }
  if (filterDebounce) clearTimeout(filterDebounce);
  filterDebounce = window.setTimeout(() => {
    emit('update:filters', next);
    filterDebounce = null;
  }, props.serverDebounce);
}
onBeforeUnmount(() => {
  if (searchDebounce) clearTimeout(searchDebounce);
  if (filterDebounce) clearTimeout(filterDebounce);
});

/* ============================================================ */
/*               自动 rowSpan 合并（mergeRows）                   */
/* ============================================================ */

interface MergeInfo { hidden: boolean; rowSpan: number; }
const cellMerges = computed<Map<number, Map<string, MergeInfo>>>(() => {
  const out = new Map<number, Map<string, MergeInfo>>();
  const flat = flatTreeRows.value;
  if (!flat.length) return out;
  for (const col of renderLeafColumns.value) {
    if (!col.mergeRows) continue;
    const eq = (cur: T, prev: T): boolean => {
      if (typeof col.mergeRows === 'function') return col.mergeRows(cur, prev);
      return getCellValue(cur, col) === getCellValue(prev, col);
    };
    let i = 0;
    while (i < flat.length) {
      let span = 1;
      for (let j = i + 1; j < flat.length; j++) {
        // 树形子行不合并
        if (flat[j].level !== flat[i].level || flat[j].parentKey !== flat[i].parentKey) break;
        if (!eq(flat[j].row, flat[i].row)) break;
        span++;
      }
      if (span > 1) {
        const m = out.get(i) ?? new Map();
        m.set(col.key, { hidden: false, rowSpan: span });
        out.set(i, m);
        for (let k = 1; k < span; k++) {
          const m2 = out.get(i + k) ?? new Map();
          m2.set(col.key, { hidden: true, rowSpan: 0 });
          out.set(i + k, m2);
        }
      }
      i += span;
    }
  }
  return out;
});

function mergeInfoOf(rowIdx: number, colKey: string): MergeInfo | undefined {
  return cellMerges.value.get(rowIdx)?.get(colKey);
}

/* ============================================================ */
/*                    单元格选区 + 拷贝                          */
/* ============================================================ */

interface CellSelection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}
const cellSelection = ref<CellSelection | null>(null);
const cellAnchor = ref<{ row: number; col: number } | null>(null);

function inSelection(rowIdx: number, colIdx: number): boolean {
  const s = cellSelection.value;
  if (!s) return false;
  const r1 = Math.min(s.startRow, s.endRow);
  const r2 = Math.max(s.startRow, s.endRow);
  const c1 = Math.min(s.startCol, s.endCol);
  const c2 = Math.max(s.startCol, s.endCol);
  return rowIdx >= r1 && rowIdx <= r2 && colIdx >= c1 && colIdx <= c2;
}
function onCellMouseDown(rowIdx: number, colIdx: number, ev: MouseEvent) {
  if (!props.cellSelectable) return;
  if (ev.shiftKey && cellAnchor.value) {
    cellSelection.value = {
      startRow: cellAnchor.value.row,
      startCol: cellAnchor.value.col,
      endRow: rowIdx,
      endCol: colIdx,
    };
    return;
  }
  cellAnchor.value = { row: rowIdx, col: colIdx };
  cellSelection.value = { startRow: rowIdx, startCol: colIdx, endRow: rowIdx, endCol: colIdx };
}
function onCellMouseEnter(rowIdx: number, colIdx: number, ev: MouseEvent) {
  if (!props.cellSelectable) return;
  // 只在按下鼠标时扩展选区
  if (ev.buttons !== 1 || !cellAnchor.value) return;
  cellSelection.value = {
    startRow: cellAnchor.value.row,
    startCol: cellAnchor.value.col,
    endRow: rowIdx,
    endCol: colIdx,
  };
}

function copySelectionToClipboard() {
  const s = cellSelection.value;
  if (!s) return;
  const r1 = Math.min(s.startRow, s.endRow);
  const r2 = Math.max(s.startRow, s.endRow);
  const c1 = Math.min(s.startCol, s.endCol);
  const c2 = Math.max(s.startCol, s.endCol);
  const lines: string[] = [];
  for (let r = r1; r <= r2; r++) {
    const fr = flatTreeRows.value[r];
    if (!fr) continue;
    const cells: string[] = [];
    for (let c = c1; c <= c2; c++) {
      const col = renderLeafColumns.value[c];
      if (!col) continue;
      const v = getCellValue(fr.row, col);
      const str = col.format ? col.format(v, fr.row, fr.index) : v == null ? '' : String(v);
      // 替换 tab / newline 防止破坏 TSV
      cells.push(str.replace(/\t/g, ' ').replace(/\r?\n/g, ' '));
    }
    lines.push(cells.join('\t'));
  }
  const tsv = lines.join('\n');
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(tsv).catch(() => {});
  }
}

function onKeyDown(ev: KeyboardEvent) {
  if (!props.cellSelectable) return;
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'c' || ev.key === 'C')) {
    if (cellSelection.value) {
      ev.preventDefault();
      copySelectionToClipboard();
    }
  }
}
onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeyDown);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown);
});

/* ============================================================ */
/*                       列虚拟化                                 */
/* ============================================================ */

const scrollLeft = ref(0);
const viewportWidth = ref(0);

function onScrollExtended(ev: Event) {
  const el = ev.target as HTMLElement;
  scrollTop.value = el.scrollTop;
  scrollLeft.value = el.scrollLeft;
}

let widthObs: ResizeObserver | null = null;
onMounted(() => {
  if (!scrollEl.value) return;
  viewportWidth.value = scrollEl.value.clientWidth;
  if (typeof ResizeObserver !== 'undefined') {
    widthObs = new ResizeObserver(() => {
      if (scrollEl.value) {
        viewportWidth.value = scrollEl.value.clientWidth;
      }
    });
    widthObs.observe(scrollEl.value);
  }
});
onBeforeUnmount(() => {
  widthObs?.disconnect();
  widthObs = null;
});

const columnLefts = computed<number[]>(() => {
  const out: number[] = [];
  let acc = 0;
  // 选择 / 展开 / 拖把柄列也占位
  if (props.rowReorderable) acc += 28;
  if (props.selectable === 'multiple') acc += 36;
  if (props.expandable) acc += 36;
  for (const c of renderLeafColumns.value) {
    out.push(acc);
    acc += widthOf(c) ?? props.colWidth ?? 120;
  }
  out.push(acc);
  return out;
});

const colWindow = computed(() => {
  if (!props.colVirtual) {
    return { start: 0, end: renderLeafColumns.value.length, padLeft: 0, padRight: 0 };
  }
  const lefts = columnLefts.value;
  const total = renderLeafColumns.value.length;
  const sl = scrollLeft.value;
  const vw = viewportWidth.value || 800;
  // 二分找第一个 lefts[i] > scrollLeft 的位置
  let start = 0;
  for (let i = total - 1; i >= 0; i--) {
    if (lefts[i] <= sl) { start = i; break; }
  }
  start = Math.max(0, start - (props.colOverscan ?? 4));
  let end = start;
  while (end < total && lefts[end] - lefts[start] < vw + (props.colOverscan ?? 4) * (props.colWidth ?? 120)) end++;
  end = Math.min(total, end + (props.colOverscan ?? 4));
  return {
    start,
    end,
    padLeft: lefts[start] - lefts[0],
    padRight: lefts[total] - lefts[end],
  };
});

const visibleColumns = computed(() => {
  if (!props.colVirtual) return renderLeafColumns.value;
  return renderLeafColumns.value.slice(colWindow.value.start, colWindow.value.end);
});

/* ============================================================ */
/*                变高行：累计偏移 + 二分查找                    */
/* ============================================================ */

const rowOffsets = computed<number[]>(() => {
  const out: number[] = [0];
  const total = flatTreeRows.value.length;
  if (props.getRowHeight) {
    let acc = 0;
    for (let i = 0; i < total; i++) {
      acc += props.getRowHeight(i) || (props.rowHeight ?? 36);
      out.push(acc);
    }
  } else {
    const h = props.rowHeight ?? 36;
    for (let i = 1; i <= total; i++) out.push(i * h);
  }
  return out;
});

const totalRowsHeight = computed(() => rowOffsets.value[rowOffsets.value.length - 1] ?? 0);

function findRowAtOffset(offset: number): number {
  const arr = rowOffsets.value;
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid + 1] <= offset) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 用 rowOffsets 重算 virtualWindow（覆盖前面 rowHeight 简单乘法）
const virtualWindowVar = computed(() => {
  if (!props.virtual) {
    return { start: 0, end: flatTreeRows.value.length, padTop: 0, padBottom: 0 };
  }
  const total = flatTreeRows.value.length;
  const overscan = props.overscan ?? 6;
  const start = Math.max(0, findRowAtOffset(scrollTop.value) - overscan);
  const endTarget = scrollTop.value + (viewportHeight.value || 400);
  let end = findRowAtOffset(endTarget) + 1;
  end = Math.min(total, end + overscan);
  return {
    start,
    end,
    padTop: rowOffsets.value[start] ?? 0,
    padBottom: Math.max(0, totalRowsHeight.value - (rowOffsets.value[end] ?? totalRowsHeight.value)),
  };
});

// 替换 visibleFlatRows 改用 virtualWindowVar
const visibleFlatRowsVar = computed(() => {
  if (!props.virtual) return flatTreeRows.value;
  return flatTreeRows.value.slice(virtualWindowVar.value.start, virtualWindowVar.value.end);
});

function rowHeightOf(idx: number): number {
  if (props.getRowHeight) return props.getRowHeight(idx) || (props.rowHeight ?? 36);
  return props.rowHeight ?? 36;
}

/* ============================================================ */
/*               TSV 粘贴 → 反向写回单元格                       */
/* ============================================================ */

function applyPasteFromClipboard(text: string) {
  if (!props.cellPastable || !cellSelection.value) return;
  const grid = parseClipboardGrid(text);
  if (!grid.length) return;

  const s = cellSelection.value;
  // 起点 = 选区左上角；扩展范围 = 粘贴板大小（不限制选区大小，让用户用单格起点也能贴出整片）
  const r0 = Math.min(s.startRow, s.endRow);
  const c0 = Math.min(s.startCol, s.endCol);

  let applied = 0;
  let skipped = 0;
  for (let dr = 0; dr < grid.length; dr++) {
    const fr = flatTreeRows.value[r0 + dr];
    if (!fr) break;
    const line = grid[dr];
    for (let dc = 0; dc < line.length; dc++) {
      const col = renderLeafColumns.value[c0 + dc];
      if (!col) break;
      if (!isCellEditable(fr.row, col, fr.index)) {
        skipped++;
        continue;
      }
      let value: unknown = line[dc];
      if (col.editType === 'number') {
        const n = Number(value);
        value = Number.isFinite(n) ? n : null;
      }
      if (col.editValidate && col.editValidate(value, fr.row, fr.index) === false) {
        skipped++;
        continue;
      }
      const oldValue = getCellValue(fr.row, col);
      if (oldValue !== value) {
        emit('cell-edit', { row: fr.row, column: col, oldValue, newValue: value, index: fr.index });
        applied++;
      }
    }
  }
  emit('cell-paste', { applied, skipped });
}

function onPaste(ev: ClipboardEvent) {
  if (!props.cellPastable || !cellSelection.value) return;
  const text = ev.clipboardData?.getData('text/plain');
  if (!text) return;
  ev.preventDefault();
  applyPasteFromClipboard(text);
}
onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('paste', onPaste);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('paste', onPaste);
});

/* ============================================================ */
/*                       历史撤销栈                               */
/* ============================================================ */

interface HistorySnapshot {
  sort: TableSort | TableSort[] | null;
  filters: Record<string, unknown>;
  search: string;
  pagination: TablePagination | null;
  columnsState: TableColumnsState;
}

const historyStack = ref<HistorySnapshot[]>([]);
const historyFuture = ref<HistorySnapshot[]>([]);

function takeSnapshot(): HistorySnapshot {
  return {
    sort: JSON.parse(JSON.stringify(activeSort.value)),
    filters: JSON.parse(JSON.stringify(activeFilters.value)),
    search: activeSearch.value,
    pagination: activePagination.value ? { ...activePagination.value } : null,
    columnsState: JSON.parse(JSON.stringify(activeColumnsState.value)),
  };
}

function pushHistory() {
  if (!props.historyEnabled) return;
  const snap = takeSnapshot();
  historyStack.value.push(snap);
  if (historyStack.value.length > (props.historyDepth ?? 50)) historyStack.value.shift();
  historyFuture.value = [];
  emit('history-change', { canUndo: historyStack.value.length > 0, canRedo: false });
}

function applySnapshot(s: HistorySnapshot) {
  if (props.sort === undefined) internalSort.value = s.sort;
  emit('update:sort', s.sort);
  if (props.filters === undefined) internalFilters.value = { ...s.filters };
  emit('update:filters', { ...s.filters });
  if (props.globalSearch === undefined) internalSearch.value = s.search;
  emit('update:globalSearch', s.search);
  if (props.pagination === undefined) internalPagination.value = s.pagination;
  if (s.pagination) emit('update:pagination', s.pagination);
  if (props.columnsState === undefined) internalColumnsState.value = { ...s.columnsState };
  emit('update:columnsState', { ...s.columnsState });
}

function undo() {
  if (!props.historyEnabled || !historyStack.value.length) return;
  const cur = takeSnapshot();
  const prev = historyStack.value.pop()!;
  historyFuture.value.push(cur);
  applySnapshot(prev);
  emit('history-change', { canUndo: historyStack.value.length > 0, canRedo: historyFuture.value.length > 0 });
}
function redo() {
  if (!props.historyEnabled || !historyFuture.value.length) return;
  const cur = takeSnapshot();
  const next = historyFuture.value.pop()!;
  historyStack.value.push(cur);
  applySnapshot(next);
  emit('history-change', { canUndo: historyStack.value.length > 0, canRedo: historyFuture.value.length > 0 });
}

// 监听需要纳入历史的状态变化（避开 undo/redo 自身触发的）
let isApplying = false;
watch(
  () => [activeSort.value, activeFilters.value, activeSearch.value, activePagination.value, activeColumnsState.value],
  () => {
    if (isApplying || !props.historyEnabled) return;
    pushHistory();
  },
  { deep: true, flush: 'post' },
);

function onHistoryKeydown(ev: KeyboardEvent) {
  if (!props.historyEnabled) return;
  const meta = ev.ctrlKey || ev.metaKey;
  if (!meta) return;
  if ((ev.key === 'z' || ev.key === 'Z') && !ev.shiftKey) {
    ev.preventDefault();
    isApplying = true;
    undo();
    nextTick(() => (isApplying = false));
  } else if ((ev.key === 'y' || ev.key === 'Y') || (ev.shiftKey && (ev.key === 'z' || ev.key === 'Z'))) {
    ev.preventDefault();
    isApplying = true;
    redo();
    nextTick(() => (isApplying = false));
  }
}
onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onHistoryKeydown);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onHistoryKeydown);
});

defineExpose({
  patchColumnsState,
  exportCsv: doExport,
  copySelection: copySelectionToClipboard,
  undo,
  redo,
});
</script>

<template>
  <div :class="cls">
    <!-- 工具栏：全局搜索 + 列可见性 -->
    <header v-if="showToolbar" class="cf-table__toolbar">
      <div class="cf-table__toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="cf-table__toolbar-right">
        <label class="cf-table__search">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path d="M14 14l-3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <input
            type="search"
            class="cf-table__search-input"
            :value="activeSearch"
            :placeholder="emptyText === '暂无数据' ? '搜索…' : 'Search…'"
            @input="setGlobalSearch(($event.target as HTMLInputElement).value)"
          />
        </label>
        <div v-if="hideableColumns.length" class="cf-table__col-menu">
          <button
            type="button"
            class="cf-table__col-menu-trigger"
            :aria-expanded="colMenuOpen"
            @click="colMenuOpen = !colMenuOpen"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <rect x="2" y="3" width="3" height="10" fill="currentColor" />
              <rect x="6.5" y="3" width="3" height="10" fill="currentColor" />
              <rect x="11" y="3" width="3" height="10" fill="currentColor" />
            </svg>
            <span>列</span>
          </button>
          <div v-if="colMenuOpen" class="cf-table__col-menu-popup" role="menu">
            <label v-for="c in hideableColumns" :key="c.key" class="cf-table__col-menu-item">
              <input
                type="checkbox"
                :checked="!hiddenSet.has(c.key)"
                @change="toggleColumnHidden(c.key)"
              />
              <span>{{ c.title ?? c.key }}</span>
            </label>
          </div>
        </div>
        <button
          v-if="exportable"
          type="button"
          class="cf-table__col-menu-trigger"
          :title="emptyText === '暂无数据' ? '导出 CSV' : 'Export CSV'"
          @click="doExport"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M8 1v9m0 0L4 6m4 4l4-4M2 13h12v2H2z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ emptyText === '暂无数据' ? '导出' : 'Export' }}</span>
        </button>
        <slot name="toolbar-right" />
      </div>
    </header>

    <div ref="scrollEl" class="cf-table__scroll" :class="cellSelectable && 'is-cell-selectable'" :style="scrollStyle" @scroll="onScrollExtended">
      <table class="cf-table__table">
        <colgroup>
          <col v-if="rowReorderable" style="width: 28px;" />
          <col v-if="selectable === 'multiple'" style="width: 36px;" />
          <col v-if="expandable" style="width: 36px;" />
          <col
            v-for="col in renderLeafColumns"
            :key="col.key"
            :style="colStyle(col)"
          />
        </colgroup>

        <!-- 表头：支持多行 -->
        <thead class="cf-table__head">
          <tr v-for="(row, rowIdx) in headerRows" :key="rowIdx">
            <th
              v-if="rowIdx === 0 && rowReorderable"
              class="cf-table__cell cf-table__cell--th cf-table__cell--row-drag"
              :rowspan="headerRows.length"
            />
            <th
              v-if="rowIdx === 0 && selectable === 'multiple'"
              class="cf-table__cell cf-table__cell--th cf-table__cell--check"
              :rowspan="headerRows.length"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate.prop="someSelected"
                aria-label="全选"
                @change="toggleAll"
              />
            </th>
            <th
              v-if="rowIdx === 0 && expandable"
              class="cf-table__cell cf-table__cell--th cf-table__cell--expand"
              :rowspan="headerRows.length"
            />
            <th
              v-for="(cell, ci) in row"
              :key="cell.column.key + ':' + ci"
              class="cf-table__cell cf-table__cell--th"
              :class="[
                alignClass(cell.column),
                cell.column.sortable && 'is-sortable',
                sortDirOf(cell.column.key) && 'is-sorted',
                fixedClass(cell.column),
                cell.column.className,
                dragOverKey === cell.column.key && 'is-drop-target',
                dragKey === cell.column.key && 'is-dragging',
              ]"
              :style="fixedStyle(cell.column)"
              :colspan="cell.colSpan > 1 ? cell.colSpan : undefined"
              :rowspan="cell.rowSpan > 1 ? cell.rowSpan : undefined"
              :draggable="cell.isLeaf && isReorderable(cell.column.key) ? 'true' : undefined"
              @click="cell.isLeaf && onSort(cell.column, $event)"
              @dragstart="cell.isLeaf && onDragStart($event, cell.column.key)"
              @dragover="cell.isLeaf && onDragOver($event, cell.column.key)"
              @drop="cell.isLeaf && onDrop($event, cell.column.key)"
              @dragend="dragKey = null; dragOverKey = null;"
            >
              <span class="cf-table__th-label">
                <slot
                  v-if="cell.column.headerRender || $slots[`header:${cell.column.key}`]"
                  :name="`header:${cell.column.key}`"
                  :column="cell.column"
                >
                  {{ cell.column.title ?? cell.column.key }}
                </slot>
                <template v-else>{{ cell.column.title ?? cell.column.key }}</template>

                <!-- 排序指示 -->
                <svg
                  v-if="cell.column.sortable"
                  class="cf-table__sort"
                  :class="`is-${sortDirOf(cell.column.key) ?? 'idle'}`"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path d="M6 2l3 3H3z" fill="currentColor" />
                  <path d="M6 10L3 7h6z" fill="currentColor" />
                </svg>
                <!-- multiSort 序号 -->
                <span
                  v-if="multiSort && sortIndexOf(cell.column.key) > 0 && sortList.length > 1"
                  class="cf-table__sort-rank"
                >{{ sortIndexOf(cell.column.key) }}</span>

                <!-- 过滤入口 -->
                <button
                  v-if="cell.column.filterable"
                  type="button"
                  class="cf-table__filter-btn"
                  :class="(activeFilters[cell.column.key] != null && activeFilters[cell.column.key] !== '') && 'is-active'"
                  :aria-label="`过滤 ${cell.column.title ?? cell.column.key}`"
                  @click.stop="openFilterKey = openFilterKey === cell.column.key ? null : cell.column.key"
                >
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                    <path d="M2 3h12l-4.5 5.5V13l-3-1.5V8.5z" fill="currentColor" />
                  </svg>
                </button>
              </span>

              <!-- 过滤弹层 -->
              <div
                v-if="cell.column.filterable && openFilterKey === cell.column.key"
                class="cf-table__filter-popup"
                @click.stop
              >
                <template v-if="cell.column.filterType === 'select' && cell.column.filterOptions">
                  <label
                    v-for="opt in cell.column.filterOptions"
                    :key="String(opt.value)"
                    class="cf-table__filter-opt"
                  >
                    <input
                      type="checkbox"
                      :checked="(activeFilters[cell.column.key] as unknown[] | undefined)?.includes(opt.value) ?? false"
                      @change="setFilterValue(
                        cell.column.key,
                        (() => {
                          const arr = ((activeFilters[cell.column.key] as unknown[]) ?? []).slice();
                          const i = arr.indexOf(opt.value);
                          if (i === -1) arr.push(opt.value); else arr.splice(i, 1);
                          return arr;
                        })()
                      )"
                    />
                    <span>{{ opt.label }}</span>
                  </label>
                </template>
                <template v-else-if="cell.column.filterType === 'number-range'">
                  <div class="cf-table__filter-range">
	                    <input
	                      type="number"
	                      :placeholder="cell.column.filterPlaceholder ?? '最小'"
	                      :value="numberRangeFilter(cell.column.key).min ?? ''"
	                      @input="setNumberRangeFilter(cell.column.key, 'min', ($event.target as HTMLInputElement).value)"
	                    />
	                    <span>—</span>
	                    <input
	                      type="number"
	                      :placeholder="cell.column.filterPlaceholder ?? '最大'"
	                      :value="numberRangeFilter(cell.column.key).max ?? ''"
	                      @input="setNumberRangeFilter(cell.column.key, 'max', ($event.target as HTMLInputElement).value)"
	                    />
                  </div>
                </template>
                <template v-else>
                  <input
                    type="text"
                    class="cf-table__filter-text"
                    :placeholder="cell.column.filterPlaceholder ?? '过滤…'"
                    :value="(activeFilters[cell.column.key] as string | undefined) ?? ''"
                    @input="setFilterValue(cell.column.key, ($event.target as HTMLInputElement).value)"
                  />
                </template>
                <div class="cf-table__filter-actions">
                  <button
                    type="button"
                    class="cf-table__filter-clear"
                    @click="setFilterValue(cell.column.key, undefined); openFilterKey = null;"
                  >清除</button>
                  <button
                    type="button"
                    class="cf-table__filter-ok"
                    @click="openFilterKey = null"
                  >确定</button>
                </div>
              </div>

              <!-- resize handle -->
              <span
                v-if="cell.isLeaf && isResizable(cell.column)"
                class="cf-table__resize-handle"
                :class="resize?.key === cell.column.key && 'is-active'"
                @click.stop
                @pointerdown="startResize($event, cell.column, widthOf(cell.column) ?? ($event.currentTarget as HTMLElement).parentElement!.getBoundingClientRect().width)"
                @pointermove="moveResize($event, cell.column)"
                @pointerup="endResize"
                @pointercancel="endResize"
              />
            </th>
          </tr>
        </thead>

        <!-- 表体 -->
        <tbody class="cf-table__body">
          <tr v-if="!flatTreeRows.length" class="cf-table__row cf-table__row--empty">
            <td
              class="cf-table__cell"
              :colspan="renderLeafColumns.length + (selectable === 'multiple' ? 1 : 0) + (expandable ? 1 : 0) + (rowReorderable ? 1 : 0)"
            >
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>

          <!-- 虚拟滚动顶部占位 -->
          <tr v-if="virtual && virtualWindowVar.padTop > 0" class="cf-table__row cf-table__row--virtual-pad" aria-hidden="true">
            <td :colspan="renderLeafColumns.length + (selectable === 'multiple' ? 1 : 0) + (expandable ? 1 : 0) + (rowReorderable ? 1 : 0)" :style="{ height: `${virtualWindowVar.padTop}px`, padding: 0, border: 0 }" />
          </tr>

          <template v-for="(fr) in visibleFlatRowsVar" :key="fr.key">
            <tr
              class="cf-table__row"
              :class="[
                selectedSet.has(fr.key) && 'is-selected',
                selectable && 'is-clickable',
                fr.level > 0 && 'is-tree-child',
                rowDragOverKey === fr.key && `is-row-drop-target is-row-drop-${rowDropPos}`,
                rowDragKey === fr.key && 'is-row-dragging',
              ]"
              :style="virtual ? { height: `${rowHeightOf(fr.index)}px` } : undefined"
              @click="selectable ? toggleRow(fr.key) : onRowClick(fr.row, fr.index)"
              @dragover="rowReorderable && onRowDragOver($event, fr.key)"
              @drop="rowReorderable && onRowDrop($event, fr.key)"
            >
              <td v-if="rowReorderable" class="cf-table__cell cf-table__cell--row-drag">
                <span
                  v-if="fr.level === 0"
                  class="cf-table__row-drag-handle"
                  draggable="true"
                  :aria-label="`拖动第 ${fr.index + 1} 行`"
                  @click.stop
                  @dragstart="onRowDragStart($event, fr.key)"
                  @dragend="rowDragKey = null; rowDragOverKey = null;"
                >
                  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                    <circle cx="4" cy="3" r="1" fill="currentColor" />
                    <circle cx="8" cy="3" r="1" fill="currentColor" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" />
                    <circle cx="8" cy="6" r="1" fill="currentColor" />
                    <circle cx="4" cy="9" r="1" fill="currentColor" />
                    <circle cx="8" cy="9" r="1" fill="currentColor" />
                  </svg>
                </span>
              </td>
              <td v-if="selectable === 'multiple'" class="cf-table__cell cf-table__cell--check">
                <input
                  type="checkbox"
                  :checked="selectedSet.has(fr.key)"
                  :aria-label="`选中第 ${fr.index + 1} 行`"
                  @click.stop
                  @change="toggleRow(fr.key)"
                />
              </td>
              <td v-if="expandable" class="cf-table__cell cf-table__cell--expand">
                <button
                  v-if="expandRender || fr.hasChildren"
                  type="button"
                  class="cf-table__expand-btn"
                  :class="expandedSet.has(fr.key) && 'is-open'"
                  :aria-expanded="expandedSet.has(fr.key)"
                  @click.stop="toggleExpand(fr.key)"
                >
                  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                    <path d="M3 4l3 3 3-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  </svg>
                </button>
              </td>
              <td
                v-for="(col, ci) in renderLeafColumns"
                v-show="!mergeInfoOf(fr.index, col.key)?.hidden"
                :key="col.key"
                class="cf-table__cell"
                :class="[
                  alignClass(col),
                  fixedClass(col),
                  col.ellipsis && 'cf-table__cell--ellipsis',
                  isCellEditable(fr.row, col, fr.index) && 'cf-table__cell--editable',
                  editing?.rowKey === fr.key && editing?.colKey === col.key && 'cf-table__cell--editing',
                  cellSelectable && inSelection(fr.index, ci) && 'cf-table__cell--cell-selected',
                  cellClassOf(fr.row, col, fr.index),
                ]"
                :style="fixedStyle(col)"
                :rowspan="mergeInfoOf(fr.index, col.key)?.rowSpan"
                @dblclick="beginEdit(fr.row, col, fr.index, fr.key)"
                @mousedown="onCellMouseDown(fr.index, ci, $event)"
                @mouseenter="onCellMouseEnter(fr.index, ci, $event)"
              >
                <span
                  v-if="ci === 0 && fr.level > 0"
                  class="cf-table__tree-indent"
                  :style="{ paddingLeft: `${fr.level * (treeIndent ?? 16)}px` }"
                />
                <!-- 编辑态 -->
                <template v-if="editing && editing.rowKey === fr.key && editing.colKey === col.key">
                  <select
                    v-if="col.editType === 'select' && col.editOptions"
                    ref="editInputRef"
                    class="cf-table__edit-input"
                    :value="editing.draft as string | number | undefined"
                    @click.stop
                    @change="editing.draft = ($event.target as HTMLSelectElement).value; commitEdit(fr.row, col, fr.index)"
                    @blur="commitEdit(fr.row, col, fr.index)"
                    @keydown="onEditKeydown($event, fr.row, col, fr.index)"
                  >
                    <option v-for="opt in col.editOptions" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option>
                  </select>
                  <input
                    v-else
                    ref="editInputRef"
                    class="cf-table__edit-input"
                    :type="col.editType === 'number' ? 'number' : 'text'"
                    :value="editing.draft as string | number | undefined"
                    @click.stop
                    @input="editing.draft = ($event.target as HTMLInputElement).value"
                    @blur="commitEdit(fr.row, col, fr.index)"
                    @keydown="onEditKeydown($event, fr.row, col, fr.index)"
                  />
                </template>
                <!-- 默认渲染 -->
                <slot
                  v-else
                  :name="`cell:${col.key}`"
                  :row="fr.row"
                  :index="fr.index"
                  :value="getCellValue(fr.row, col)"
                >
                  <component
                    v-if="col.render"
                    :is="'span'"
                  >
	                    <RenderInline :render="col.render as any" :args="[getCellValue(fr.row, col), fr.row, fr.index]" />
                  </component>
                  <template v-else>{{ cellOf(fr.row, col, fr.index) }}</template>
                </slot>
              </td>
            </tr>
            <!-- expand row -->
            <tr
              v-if="expandable && expandRender && expandedSet.has(fr.key) && !fr.hasChildren"
              class="cf-table__row cf-table__row--expand"
            >
              <td
                class="cf-table__cell cf-table__expand-content"
                :colspan="renderLeafColumns.length + (selectable === 'multiple' ? 1 : 0) + (rowReorderable ? 1 : 0) + 1"
              >
	                <RenderInline :render="((_v: unknown, r: T, i: number) => expandRender!(r, i)) as any" :args="[undefined, fr.row, fr.index]" />
              </td>
            </tr>
          </template>
          <!-- 虚拟滚动底部占位 -->
          <tr v-if="virtual && virtualWindowVar.padBottom > 0" class="cf-table__row cf-table__row--virtual-pad" aria-hidden="true">
            <td :colspan="renderLeafColumns.length + (selectable === 'multiple' ? 1 : 0) + (expandable ? 1 : 0) + (rowReorderable ? 1 : 0)" :style="{ height: `${virtualWindowVar.padBottom}px`, padding: 0, border: 0 }" />
          </tr>
        </tbody>

        <!-- 总计行 -->
        <tfoot v-if="summaryRows.length" class="cf-table__foot">
          <tr
            v-for="(srow, si) in summaryRows"
            :key="si"
            class="cf-table__summary-row"
            :class="srow.className"
          >
            <td v-if="rowReorderable" class="cf-table__cell cf-table__cell--row-drag" />
            <td v-if="selectable === 'multiple'" class="cf-table__cell cf-table__cell--check" />
            <td v-if="expandable" class="cf-table__cell cf-table__cell--expand" />
            <td
              v-for="col in renderLeafColumns"
              :key="col.key"
              class="cf-table__cell"
              :class="[alignClass(col), fixedClass(col)]"
              :style="fixedStyle(col)"
            >{{ summaryCellOf(srow, col) }}</td>
          </tr>
        </tfoot>
      </table>

      <!-- loading 遮罩 -->
      <div v-if="loading" class="cf-table__loading-overlay" aria-hidden="true">
        <span class="cf-table__loading-spinner" />
      </div>
    </div>

    <!-- 分页栏 -->
    <footer v-if="activePagination" class="cf-table__pagination">
      <div class="cf-table__pagination-info">
        <span v-if="activePagination.showTotal !== false">
          共 {{ totalCount }} 条
        </span>
      </div>
      <div class="cf-table__pagination-pager">
        <button type="button" class="cf-table__pager-btn" :disabled="activePagination.page <= 1" @click="gotoPage(activePagination.page - 1)">
          ‹
        </button>
        <span class="cf-table__pager-current">
          {{ activePagination.page }} / {{ pageCount }}
        </span>
        <button type="button" class="cf-table__pager-btn" :disabled="activePagination.page >= pageCount" @click="gotoPage(activePagination.page + 1)">
          ›
        </button>
        <select
          v-if="activePagination.showSizeChanger !== false"
          class="cf-table__pager-size"
          :value="activePagination.pageSize"
          @change="changePageSize(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="n in (activePagination.pageSizeOptions ?? [10, 20, 50, 100])" :key="n" :value="n">{{ n }} / 页</option>
        </select>
      </div>
    </footer>
  </div>
</template>

<!-- 内嵌的 render-prop 渲染器：把外部传入的渲染函数变成 VNode 子节点。 -->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue';
export const RenderInline = defineComponent({
  name: 'CfTableRenderInline',
  props: {
    render: {
      type: Function as PropType<(...args: unknown[]) => unknown>,
      required: true,
    },
    args: { type: Array as PropType<unknown[]>, default: () => [] },
  },
  setup(p) {
    return () => {
      const out = p.render(...p.args);
      // 渲染函数返回字符串 / VNode / 数组都直接交给 h 处理
      return out as any;
    };
  },
});
</script>
