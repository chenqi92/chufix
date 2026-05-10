/**
 * ChuFix UI · Table (React mirror of @chufix-design/vue Table).
 * 同样的 API、同样的能力、同样的 class 名。
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  aggregate,
  compareCells,
  computeHeaderRows,
  defaultFilterMatch,
  defaultGlobalSearchMatch,
  flattenColumns,
  getCellValue,
  getRowKey,
  nextSortDirection,
  tableClass,
  type SortDirection,
  type TableColumn,
  type TableColumnsState,
  type TablePagination,
  type TableProps,
  type TableSort,
  type TableSummaryRow,
} from './variants';

/** React 端额外开放的回调 props（除了 TableProps 里已有的）。*/
export interface ReactTableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends TableProps<T> {
  className?: string;
  onSortChange?: (sort: TableSort | TableSort[] | null) => void;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
  onGlobalSearchChange?: (value: string) => void;
  onPaginationChange?: (value: TablePagination) => void;
  onSelectChange?: (value: string | string[] | null) => void;
  onColumnsStateChange?: (value: TableColumnsState) => void;
  onExpandedRowKeysChange?: (value: string[]) => void;
  onRowClick?: (row: T, index: number) => void;
  /** Header / cell render maps keyed by column.key. */
  renderHeader?: Record<string, (column: TableColumn<T>) => ReactNode>;
  renderCell?: Record<string, (ctx: { row: T; index: number; value: unknown }) => ReactNode>;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
  empty?: ReactNode;
}

interface FlatRow<T> {
  row: T;
  key: string;
  level: number;
  index: number;
  parentKey: string | null;
  hasChildren: boolean;
}

export function Table<T extends Record<string, unknown> = Record<string, unknown>>(
  props: ReactTableProps<T>,
) {
  const {
    columns,
    rows,
    rowKey,
    size = 'md',
    variant = 'default',
    hoverable = true,
    emptyText = 'No data',
    loading = false,
    stickyHeader = false,
    height,
    sort,
    defaultSort = null,
    multiSort = false,
    filters,
    defaultFilters,
    globalSearch,
    defaultGlobalSearch,
    globalSearchFn,
    pagination,
    defaultPagination,
    selectable,
    modelValue,
    expandable,
    expandRender,
    expandedRowKeys,
    defaultExpandedRowKeys,
    childrenField = 'children',
    treeIndent = 16,
    columnsState,
    defaultColumnsState,
    resizable = false,
    reorderable = false,
    showSummary = false,
    summary,
    toolbar = 'none',
    className,
    onSortChange,
    onFiltersChange,
    onGlobalSearchChange,
    onPaginationChange,
    onSelectChange,
    onColumnsStateChange,
    onExpandedRowKeysChange,
    onRowClick,
    renderHeader,
    renderCell,
    toolbarLeft,
    toolbarRight,
    empty,
  } = props;

  /* ---------------- internal state (uncontrolled fallbacks) ---------------- */
  const [internalSort, setInternalSort] = useState<TableSort | TableSort[] | null>(defaultSort ?? null);
  const activeSort = sort !== undefined ? sort : internalSort;
  const sortList = useMemo<TableSort[]>(() => {
    if (!activeSort) return [];
    return Array.isArray(activeSort)
      ? activeSort.filter((s) => s.direction)
      : activeSort.direction
        ? [activeSort]
        : [];
  }, [activeSort]);

  const [internalFilters, setInternalFilters] = useState<Record<string, unknown>>(defaultFilters ?? {});
  const activeFilters = filters !== undefined ? filters : internalFilters;

  const [internalSearch, setInternalSearch] = useState<string>(defaultGlobalSearch ?? '');
  const activeSearch = globalSearch !== undefined ? globalSearch : internalSearch;

  const [internalPagination, setInternalPagination] = useState<TablePagination | null>(
    defaultPagination ?? null,
  );
  const activePagination =
    pagination === false ? null : pagination !== undefined ? (pagination ?? null) : internalPagination;
  const isServerPagination = activePagination?.total != null;

  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedRowKeys ?? []);
  const expandedSet = useMemo(
    () => new Set(expandedRowKeys !== undefined ? expandedRowKeys : internalExpanded),
    [expandedRowKeys, internalExpanded],
  );

  const [internalColumnsState, setInternalColumnsState] = useState<TableColumnsState>(
    defaultColumnsState ?? {
      hidden: columns.filter((c) => c.hidden).map((c) => c.key),
      order: undefined,
      widths: {},
    },
  );
  const activeColumnsState = columnsState !== undefined ? columnsState : internalColumnsState;

  const patchColumnsState = useCallback(
    (patch: Partial<TableColumnsState>) => {
      const next: TableColumnsState = {
        ...activeColumnsState,
        ...patch,
        hidden: patch.hidden ?? activeColumnsState.hidden ?? [],
        widths: { ...(activeColumnsState.widths ?? {}), ...(patch.widths ?? {}) },
      };
      if (columnsState === undefined) setInternalColumnsState(next);
      onColumnsStateChange?.(next);
    },
    [activeColumnsState, columnsState, onColumnsStateChange],
  );

  /* ---------------- columns derivation ---------------- */
  const allLeafColumns = useMemo(() => flattenColumns(columns), [columns]);

  const renderLeafColumns = useMemo<TableColumn<T>[]>(() => {
    const hidden = new Set(activeColumnsState.hidden ?? []);
    const widths = activeColumnsState.widths ?? {};
    let arr = allLeafColumns.filter((c) => !hidden.has(c.key));
    if (activeColumnsState.order?.length) {
      const idx = new Map(activeColumnsState.order.map((k, i) => [k, i]));
      arr = [...arr].sort((a, b) => (idx.get(a.key) ?? Infinity) - (idx.get(b.key) ?? Infinity));
    }
    return arr.map((c) => (widths[c.key] != null ? { ...c, width: widths[c.key] } : c));
  }, [allLeafColumns, activeColumnsState]);

  const headerRows = useMemo(() => {
    const hidden = new Set(activeColumnsState.hidden ?? []);
    const hasOrder = !!activeColumnsState.order?.length;
    const anyHidden = (activeColumnsState.hidden ?? []).length > 0;
    if (anyHidden || hasOrder) {
      return [
        renderLeafColumns.map((c) => ({ column: c, colSpan: 1, rowSpan: 1, isLeaf: true })),
      ];
    }
    return computeHeaderRows(columns).map((row) =>
      row
        .map((cell) => (cell.isLeaf && hidden.has(cell.column.key) ? null : cell))
        .filter((x): x is NonNullable<typeof x> => x !== null),
    );
  }, [columns, renderLeafColumns, activeColumnsState]);

  /* ---------------- filter -> sort -> paginate ---------------- */
  const filteredRows = useMemo(() => {
    let arr = rows;
    if (activeSearch) {
      arr = arr.filter((r, i) =>
        globalSearchFn
          ? globalSearchFn(activeSearch, r, i)
          : defaultGlobalSearchMatch(activeSearch, r, allLeafColumns),
      );
    }
    for (const col of allLeafColumns) {
      const fv = activeFilters[col.key];
      if (fv == null || fv === '' || (Array.isArray(fv) && fv.length === 0)) continue;
      if (col.filterFn) {
        arr = arr.filter((r, i) => col.filterFn!(fv, r, i));
      } else {
        arr = arr.filter((r) => defaultFilterMatch(fv, getCellValue(r, col)));
      }
    }
    return arr;
  }, [rows, activeSearch, activeFilters, allLeafColumns, globalSearchFn]);

  const sortedRows = useMemo(() => {
    if (!sortList.length) return filteredRows;
    const colByKey = new Map(allLeafColumns.map((c) => [c.key, c]));
    return [...filteredRows].sort((a, b) => {
      for (const s of sortList) {
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
  }, [filteredRows, sortList, allLeafColumns]);

  const paginatedRows = useMemo(() => {
    if (!activePagination || isServerPagination) return sortedRows;
    const start = (activePagination.page - 1) * activePagination.pageSize;
    return sortedRows.slice(start, start + activePagination.pageSize);
  }, [sortedRows, activePagination, isServerPagination]);

  /* ---------------- tree flatten ---------------- */
  const flatTreeRows = useMemo<FlatRow<T>[]>(() => {
    const out: FlatRow<T>[] = [];
    let nextIndex = 0;
    function walk(arr: T[], level: number, parentKey: string | null) {
      for (const r of arr) {
        const k = getRowKey(r, nextIndex, rowKey);
        const children = (r as Record<string, unknown>)[childrenField] as T[] | undefined;
        const hasChildren = !!children?.length;
        out.push({ row: r, key: k, level, index: nextIndex++, parentKey, hasChildren });
        if (hasChildren && expandedSet.has(k)) walk(children!, level + 1, k);
      }
    }
    walk(paginatedRows, 0, null);
    return out;
  }, [paginatedRows, rowKey, childrenField, expandedSet]);

  /* ---------------- selection ---------------- */
  const selectedSet = useMemo(() => {
    if (selectable === 'multiple') {
      const arr = Array.isArray(modelValue) ? modelValue : [];
      return new Set(arr);
    }
    if (selectable === 'single') {
      return new Set(modelValue ? [modelValue as string] : []);
    }
    return new Set<string>();
  }, [selectable, modelValue]);
  const allSelected =
    selectable === 'multiple' &&
    flatTreeRows.length > 0 &&
    flatTreeRows.every((r) => selectedSet.has(r.key));
  const someSelected = !allSelected && selectedSet.size > 0;

  const toggleRow = (key: string) => {
    if (selectable === 'single') {
      onSelectChange?.(selectedSet.has(key) ? null : key);
      return;
    }
    if (selectable !== 'multiple') return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectChange?.(Array.from(next));
  };
  const toggleAll = () => {
    if (selectable !== 'multiple') return;
    if (allSelected) onSelectChange?.([]);
    else onSelectChange?.(flatTreeRows.map((r) => r.key));
  };

  /* ---------------- expanded rows ---------------- */
  const setExpanded = (next: string[]) => {
    if (expandedRowKeys === undefined) setInternalExpanded(next);
    onExpandedRowKeysChange?.(next);
  };
  const toggleExpand = (key: string) => {
    const cur = expandedSet;
    const next = cur.has(key) ? Array.from(cur).filter((k) => k !== key) : [...Array.from(cur), key];
    setExpanded(next);
  };

  /* ---------------- sort ---------------- */
  const sortDirOf = (key: string): SortDirection =>
    sortList.find((s) => s.key === key)?.direction ?? null;
  const sortIndexOf = (key: string): number => {
    const i = sortList.findIndex((s) => s.key === key);
    return i === -1 ? -1 : i + 1;
  };

  const onSort = (col: TableColumn<T>, ev: ReactMouseEvent) => {
    if (!col.sortable) return;
    const list = sortList;
    const idx = list.findIndex((s) => s.key === col.key);
    if (multiSort && (ev.shiftKey || ev.metaKey)) {
      let next: TableSort[];
      if (idx === -1) next = [...list, { key: col.key, direction: 'asc' }];
      else {
        const dir = nextSortDirection(list[idx].direction);
        next = [...list];
        if (dir) next[idx] = { key: col.key, direction: dir };
        else next.splice(idx, 1);
      }
      if (sort === undefined) setInternalSort(next);
      onSortChange?.(next);
      return;
    }
    let next: TableSort | null;
    if (idx !== -1) {
      const dir = nextSortDirection(list[idx].direction);
      next = dir ? { key: col.key, direction: dir } : null;
    } else {
      next = { key: col.key, direction: 'asc' };
    }
    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  /* ---------------- filter ---------------- */
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);
  const setFilterValue = (key: string, value: unknown) => {
    const next = { ...activeFilters, [key]: value };
    if (value == null || value === '' || (Array.isArray(value) && !value.length)) delete next[key];
    if (filters === undefined) setInternalFilters(next);
    onFiltersChange?.(next);
    if (activePagination && !isServerPagination && activePagination.page !== 1) {
      setPagination({ ...activePagination, page: 1 });
    }
  };

  /* ---------------- search ---------------- */
  const setGlobalSearch = (v: string) => {
    if (globalSearch === undefined) setInternalSearch(v);
    onGlobalSearchChange?.(v);
    if (activePagination && !isServerPagination && activePagination.page !== 1) {
      setPagination({ ...activePagination, page: 1 });
    }
  };

  /* ---------------- pagination ---------------- */
  const setPagination = (next: TablePagination) => {
    if (pagination === undefined) setInternalPagination(next);
    onPaginationChange?.(next);
  };
  const totalCount = activePagination
    ? (activePagination.total ?? sortedRows.length)
    : sortedRows.length;
  const pageCount = activePagination
    ? Math.max(1, Math.ceil(totalCount / activePagination.pageSize))
    : 1;
  const gotoPage = (page: number) => {
    if (!activePagination) return;
    const next = Math.max(1, Math.min(pageCount, page));
    if (next !== activePagination.page) setPagination({ ...activePagination, page: next });
  };

  /* ---------------- reorder ---------------- */
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const isReorderable = (key: string) => {
    if (!reorderable) return false;
    const c = allLeafColumns.find((x) => x.key === key);
    return !!c && c.reorderable !== false && !c.fixed;
  };
  const onDragStart = (ev: DragEvent, key: string) => {
    if (!isReorderable(key)) return;
    setDragKey(key);
    ev.dataTransfer.setData('text/plain', key);
    ev.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (ev: DragEvent, key: string) => {
    if (!dragKey || dragKey === key) return;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    if (dragOverKey !== key) setDragOverKey(key);
  };
  const onDrop = (ev: DragEvent, key: string) => {
    ev.preventDefault();
    const from = dragKey;
    if (!from || from === key) {
      setDragKey(null);
      setDragOverKey(null);
      return;
    }
    const order = renderLeafColumns.map((c) => c.key);
    const fromIdx = order.indexOf(from);
    const toIdx = order.indexOf(key);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = order.splice(fromIdx, 1);
    order.splice(toIdx, 0, moved);
    patchColumnsState({ order });
    setDragKey(null);
    setDragOverKey(null);
  };

  /* ---------------- resize ---------------- */
  const resizeRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);
  const isResizableCol = (col: TableColumn<T>) =>
    col.resizable !== false && (resizable || col.resizable === true);
  const startResize = (ev: ReactPointerEvent, col: TableColumn<T>, currentWidth: number) => {
    if (!isResizableCol(col)) return;
    ev.preventDefault();
    resizeRef.current = { key: col.key, startX: ev.clientX, startWidth: currentWidth };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  };
  const moveResize = (ev: ReactPointerEvent, col: TableColumn<T>) => {
    const r = resizeRef.current;
    if (!r || r.key !== col.key) return;
    const dx = ev.clientX - r.startX;
    const min = col.minWidth ?? 60;
    const max = col.maxWidth ?? 9999;
    const next = Math.max(min, Math.min(max, r.startWidth + dx));
    patchColumnsState({ widths: { [col.key]: next } });
  };
  const endResize = () => {
    resizeRef.current = null;
  };

  /* ---------------- fixed offsets ---------------- */
  const widthOf = (c: TableColumn<T>): number | undefined => {
    if (typeof c.width === 'number') return c.width;
    if (typeof c.width === 'string' && c.width.endsWith('px')) {
      const n = parseFloat(c.width);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };
  const fixedOffsets = useMemo<Record<string, { left?: number; right?: number }>>(() => {
    const out: Record<string, { left?: number; right?: number }> = {};
    let lo = 0;
    for (const c of renderLeafColumns) {
      if (c.fixed === 'left') {
        out[c.key] = { left: lo };
        lo += widthOf(c) ?? 120;
      }
    }
    let ro = 0;
    for (let i = renderLeafColumns.length - 1; i >= 0; i--) {
      const c = renderLeafColumns[i];
      if (c.fixed === 'right') {
        out[c.key] = { right: ro };
        ro += widthOf(c) ?? 120;
      }
    }
    return out;
  }, [renderLeafColumns]);

  /* ---------------- column visibility menu ---------------- */
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const hideableColumns = useMemo(
    () => allLeafColumns.filter((c) => c.hideable !== false),
    [allLeafColumns],
  );
  const hiddenSet = useMemo(
    () => new Set(activeColumnsState.hidden ?? []),
    [activeColumnsState.hidden],
  );
  const toggleColumnHidden = (key: string) => {
    const cur = new Set(hiddenSet);
    if (cur.has(key)) cur.delete(key);
    else cur.add(key);
    patchColumnsState({ hidden: Array.from(cur) });
  };

  /* ---------------- summary ---------------- */
  const autoSummaryRow = useMemo<TableSummaryRow<T> | null>(() => {
    if (!showSummary) return null;
    const cells: Record<string, unknown> = {};
    for (const c of renderLeafColumns) {
      if (!c.summary) continue;
      cells[c.key] = aggregate(filteredRows, c);
    }
    return Object.keys(cells).length
      ? { cells, className: 'cf-table__summary-row--auto' }
      : null;
  }, [showSummary, renderLeafColumns, filteredRows]);
  const summaryRows = useMemo<TableSummaryRow<T>[]>(() => {
    const list: TableSummaryRow<T>[] = [];
    if (autoSummaryRow) list.push(autoSummaryRow);
    if (summary) list.push(...summary);
    return list;
  }, [autoSummaryRow, summary]);

  const summaryCellOf = (srow: TableSummaryRow<T>, col: TableColumn<T>): ReactNode => {
    const v = srow.cells[col.key];
    if (v === undefined) return '';
    if (col.summaryRender) return col.summaryRender(v) as ReactNode;
    if (typeof v === 'number') return Number.isInteger(v) ? v : v.toFixed(2);
    return v as ReactNode;
  };

  /* ---------------- visual helpers ---------------- */
  const tableCls = tableClass({
    size,
    variant,
    hoverable,
    loading,
    stickyHeader,
  });
  const fullCls = [tableCls, className].filter(Boolean).join(' ');
  const scrollStyle: CSSProperties | undefined =
    height != null
      ? { maxHeight: typeof height === 'number' ? `${height}px` : height }
      : undefined;
  const alignClass = (col: TableColumn<T>) =>
    col.align ? `cf-table__cell--${col.align}` : '';
  const fixedClass = (col: TableColumn<T>) =>
    col.fixed ? `cf-table__cell--fixed cf-table__cell--fixed-${col.fixed}` : '';
  const fixedStyle = (col: TableColumn<T>): CSSProperties | undefined => {
    const o = fixedOffsets[col.key];
    if (!o) return undefined;
    if (o.left != null) return { left: `${o.left}px` };
    if (o.right != null) return { right: `${o.right}px` };
    return undefined;
  };
  const colStyle = (col: TableColumn<T>): CSSProperties | undefined =>
    col.width != null
      ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
      : undefined;

  const cellOf = (row: T, col: TableColumn<T>, index: number): ReactNode => {
    if (col.render) return col.render(getCellValue(row, col), row, index) as ReactNode;
    const v = getCellValue(row, col);
    if (col.format) return col.format(v, row, index);
    return v as ReactNode;
  };
  const cellClassOf = (row: T, col: TableColumn<T>, index: number): string => {
    if (typeof col.cellClass === 'function') return col.cellClass(row, index);
    return col.cellClass ?? '';
  };

  /* ---------------- toolbar visibility ---------------- */
  const showToolbar =
    toolbar !== 'none' &&
    (globalSearch !== undefined ||
      defaultGlobalSearch !== undefined ||
      !!globalSearchFn ||
      hideableColumns.length > 0);

  /* ---------------- close popups on outside click ---------------- */
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openFilterKey && !colMenuOpen) return;
    const handler = (ev: MouseEvent) => {
      if (!rootRef.current?.contains(ev.target as Node)) {
        setOpenFilterKey(null);
        setColMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openFilterKey, colMenuOpen]);

  return (
    <div ref={rootRef} className={fullCls}>
      {showToolbar && (
        <header className="cf-table__toolbar">
          <div className="cf-table__toolbar-left">{toolbarLeft}</div>
          <div className="cf-table__toolbar-right">
            <label className="cf-table__search">
              <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden>
                <circle cx={7} cy={7} r={5} fill="none" stroke="currentColor" strokeWidth={1.6} />
                <path d="M14 14l-3-3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
              <input
                type="search"
                className="cf-table__search-input"
                value={activeSearch}
                placeholder="Search…"
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </label>
            {hideableColumns.length > 0 && (
              <div className="cf-table__col-menu">
                <button
                  type="button"
                  className="cf-table__col-menu-trigger"
                  aria-expanded={colMenuOpen}
                  onClick={() => setColMenuOpen(!colMenuOpen)}
                >
                  <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden>
                    <rect x={2} y={3} width={3} height={10} fill="currentColor" />
                    <rect x={6.5} y={3} width={3} height={10} fill="currentColor" />
                    <rect x={11} y={3} width={3} height={10} fill="currentColor" />
                  </svg>
                  <span>Columns</span>
                </button>
                {colMenuOpen && (
                  <div className="cf-table__col-menu-popup" role="menu">
                    {hideableColumns.map((c) => (
                      <label key={c.key} className="cf-table__col-menu-item">
                        <input
                          type="checkbox"
                          checked={!hiddenSet.has(c.key)}
                          onChange={() => toggleColumnHidden(c.key)}
                        />
                        <span>{c.title ?? c.key}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {toolbarRight}
          </div>
        </header>
      )}

      <div className="cf-table__scroll" style={scrollStyle}>
        <table className="cf-table__table">
          <colgroup>
            {selectable === 'multiple' && <col style={{ width: 36 }} />}
            {expandable && <col style={{ width: 36 }} />}
            {renderLeafColumns.map((col) => (
              <col key={col.key} style={colStyle(col)} />
            ))}
          </colgroup>

          <thead className="cf-table__head">
            {headerRows.map((row, ri) => (
              <tr key={ri}>
                {ri === 0 && selectable === 'multiple' && (
                  <th
                    className="cf-table__cell cf-table__cell--th cf-table__cell--check"
                    rowSpan={headerRows.length}
                  >
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      aria-label="Select all"
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {ri === 0 && expandable && (
                  <th
                    className="cf-table__cell cf-table__cell--th cf-table__cell--expand"
                    rowSpan={headerRows.length}
                  />
                )}
                {row.map((cell, ci) => {
                  const col = cell.column;
                  const dir = sortDirOf(col.key);
                  return (
                    <th
                      key={`${col.key}:${ci}`}
                      className={[
                        'cf-table__cell cf-table__cell--th',
                        alignClass(col),
                        col.sortable ? 'is-sortable' : '',
                        dir ? 'is-sorted' : '',
                        fixedClass(col),
                        col.className ?? '',
                        dragOverKey === col.key ? 'is-drop-target' : '',
                        dragKey === col.key ? 'is-dragging' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={fixedStyle(col)}
                      colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                      rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                      draggable={cell.isLeaf && isReorderable(col.key)}
                      onClick={(e) => cell.isLeaf && onSort(col, e)}
                      onDragStart={(e) => cell.isLeaf && onDragStart(e, col.key)}
                      onDragOver={(e) => cell.isLeaf && onDragOver(e, col.key)}
                      onDrop={(e) => cell.isLeaf && onDrop(e, col.key)}
                      onDragEnd={() => {
                        setDragKey(null);
                        setDragOverKey(null);
                      }}
                    >
                      <span className="cf-table__th-label">
                        {renderHeader?.[col.key]
                          ? renderHeader[col.key](col)
                          : col.headerRender
                            ? (col.headerRender() as ReactNode)
                            : (col.title ?? col.key)}
                        {col.sortable && (
                          <svg
                            className={`cf-table__sort is-${dir ?? 'idle'}`}
                            viewBox="0 0 12 12"
                            aria-hidden
                          >
                            <path d="M6 2l3 3H3z" fill="currentColor" />
                            <path d="M6 10L3 7h6z" fill="currentColor" />
                          </svg>
                        )}
                        {multiSort && sortIndexOf(col.key) > 0 && sortList.length > 1 && (
                          <span className="cf-table__sort-rank">{sortIndexOf(col.key)}</span>
                        )}
                        {col.filterable && (
                          <button
                            type="button"
                            className={[
                              'cf-table__filter-btn',
                              activeFilters[col.key] != null && activeFilters[col.key] !== ''
                                ? 'is-active'
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            aria-label={`Filter ${col.title ?? col.key}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilterKey(openFilterKey === col.key ? null : col.key);
                            }}
                          >
                            <svg viewBox="0 0 16 16" width={12} height={12} aria-hidden>
                              <path d="M2 3h12l-4.5 5.5V13l-3-1.5V8.5z" fill="currentColor" />
                            </svg>
                          </button>
                        )}
                      </span>

                      {col.filterable && openFilterKey === col.key && (
                        <div
                          className="cf-table__filter-popup"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.filterType === 'select' && col.filterOptions ? (
                            col.filterOptions.map((opt) => {
                              const cur = (activeFilters[col.key] as unknown[]) ?? [];
                              return (
                                <label key={String(opt.value)} className="cf-table__filter-opt">
                                  <input
                                    type="checkbox"
                                    checked={cur.includes(opt.value)}
                                    onChange={() => {
                                      const arr = cur.slice();
                                      const i = arr.indexOf(opt.value);
                                      if (i === -1) arr.push(opt.value);
                                      else arr.splice(i, 1);
                                      setFilterValue(col.key, arr);
                                    }}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              );
                            })
                          ) : col.filterType === 'number-range' ? (
                            <div className="cf-table__filter-range">
                              <input
                                type="number"
                                placeholder={col.filterPlaceholder ?? 'Min'}
                                value={(activeFilters[col.key] as { min?: number })?.min ?? ''}
                                onChange={(e) =>
                                  setFilterValue(col.key, {
                                    ...((activeFilters[col.key] as object) ?? {}),
                                    min: e.target.value === '' ? undefined : Number(e.target.value),
                                  })
                                }
                              />
                              <span>—</span>
                              <input
                                type="number"
                                placeholder={col.filterPlaceholder ?? 'Max'}
                                value={(activeFilters[col.key] as { max?: number })?.max ?? ''}
                                onChange={(e) =>
                                  setFilterValue(col.key, {
                                    ...((activeFilters[col.key] as object) ?? {}),
                                    max: e.target.value === '' ? undefined : Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              className="cf-table__filter-text"
                              placeholder={col.filterPlaceholder ?? 'Filter…'}
                              value={(activeFilters[col.key] as string) ?? ''}
                              onChange={(e) => setFilterValue(col.key, e.target.value)}
                            />
                          )}
                          <div className="cf-table__filter-actions">
                            <button
                              type="button"
                              className="cf-table__filter-clear"
                              onClick={() => {
                                setFilterValue(col.key, undefined);
                                setOpenFilterKey(null);
                              }}
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              className="cf-table__filter-ok"
                              onClick={() => setOpenFilterKey(null)}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      )}

                      {cell.isLeaf && isResizableCol(col) && (
                        <span
                          className={[
                            'cf-table__resize-handle',
                            resizeRef.current?.key === col.key ? 'is-active' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) =>
                            startResize(
                              e,
                              col,
                              widthOf(col) ??
                                (e.currentTarget.parentElement!.getBoundingClientRect().width || 0),
                            )
                          }
                          onPointerMove={(e) => moveResize(e, col)}
                          onPointerUp={endResize}
                          onPointerCancel={endResize}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="cf-table__body">
            {flatTreeRows.length === 0 ? (
              <tr className="cf-table__row cf-table__row--empty">
                <td
                  className="cf-table__cell"
                  colSpan={
                    renderLeafColumns.length +
                    (selectable === 'multiple' ? 1 : 0) +
                    (expandable ? 1 : 0)
                  }
                >
                  {empty ?? emptyText}
                </td>
              </tr>
            ) : (
              flatTreeRows.map((fr) => (
                <Row
                  key={fr.key}
                  fr={fr}
                  cols={renderLeafColumns}
                  selectable={selectable}
                  selected={selectedSet.has(fr.key)}
                  expandable={!!expandable}
                  expanded={expandedSet.has(fr.key)}
                  expandRender={expandRender}
                  treeIndent={treeIndent}
                  toggleRow={toggleRow}
                  toggleExpand={toggleExpand}
                  onRowClick={onRowClick}
                  alignClass={alignClass}
                  fixedClass={fixedClass}
                  fixedStyle={fixedStyle}
                  cellOf={cellOf}
                  cellClassOf={cellClassOf}
                  renderCell={renderCell}
                />
              ))
            )}
          </tbody>

          {summaryRows.length > 0 && (
            <tfoot className="cf-table__foot">
              {summaryRows.map((srow, si) => (
                <tr
                  key={si}
                  className={['cf-table__summary-row', srow.className ?? ''].filter(Boolean).join(' ')}
                >
                  {selectable === 'multiple' && <td className="cf-table__cell cf-table__cell--check" />}
                  {expandable && <td className="cf-table__cell cf-table__cell--expand" />}
                  {renderLeafColumns.map((col) => (
                    <td
                      key={col.key}
                      className={['cf-table__cell', alignClass(col), fixedClass(col)].filter(Boolean).join(' ')}
                      style={fixedStyle(col)}
                    >
                      {summaryCellOf(srow, col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>

        {loading && (
          <div className="cf-table__loading-overlay" aria-hidden>
            <span className="cf-table__loading-spinner" />
          </div>
        )}
      </div>

      {activePagination && (
        <footer className="cf-table__pagination">
          <div className="cf-table__pagination-info">
            {activePagination.showTotal !== false && <span>Total {totalCount}</span>}
          </div>
          <div className="cf-table__pagination-pager">
            <button
              type="button"
              className="cf-table__pager-btn"
              disabled={activePagination.page <= 1}
              onClick={() => gotoPage(activePagination.page - 1)}
            >
              ‹
            </button>
            <span className="cf-table__pager-current">
              {activePagination.page} / {pageCount}
            </span>
            <button
              type="button"
              className="cf-table__pager-btn"
              disabled={activePagination.page >= pageCount}
              onClick={() => gotoPage(activePagination.page + 1)}
            >
              ›
            </button>
            {activePagination.showSizeChanger !== false && (
              <select
                className="cf-table__pager-size"
                value={activePagination.pageSize}
                onChange={(e) =>
                  setPagination({
                    ...activePagination,
                    pageSize: Number(e.target.value),
                    page: 1,
                  })
                }
              >
                {(activePagination.pageSizeOptions ?? [10, 20, 50, 100]).map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

interface RowProps<T> {
  fr: FlatRow<T>;
  cols: TableColumn<T>[];
  selectable?: 'single' | 'multiple';
  selected: boolean;
  expandable: boolean;
  expanded: boolean;
  expandRender?: (row: T, index: number) => unknown;
  treeIndent: number;
  toggleRow: (key: string) => void;
  toggleExpand: (key: string) => void;
  onRowClick?: (row: T, index: number) => void;
  alignClass: (col: TableColumn<T>) => string;
  fixedClass: (col: TableColumn<T>) => string;
  fixedStyle: (col: TableColumn<T>) => CSSProperties | undefined;
  cellOf: (row: T, col: TableColumn<T>, index: number) => ReactNode;
  cellClassOf: (row: T, col: TableColumn<T>, index: number) => string;
  renderCell?: Record<string, (ctx: { row: T; index: number; value: unknown }) => ReactNode>;
}

function Row<T extends Record<string, unknown>>(p: RowProps<T>) {
  const { fr, cols } = p;
  const row = fr.row;
  return (
    <>
      <tr
        className={[
          'cf-table__row',
          p.selected ? 'is-selected' : '',
          p.selectable ? 'is-clickable' : '',
          fr.level > 0 ? 'is-tree-child' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => (p.selectable ? p.toggleRow(fr.key) : p.onRowClick?.(row, fr.index))}
      >
        {p.selectable === 'multiple' && (
          <td className="cf-table__cell cf-table__cell--check">
            <input
              type="checkbox"
              checked={p.selected}
              aria-label={`Select row ${fr.index + 1}`}
              onClick={(e) => e.stopPropagation()}
              onChange={() => p.toggleRow(fr.key)}
            />
          </td>
        )}
        {p.expandable && (
          <td className="cf-table__cell cf-table__cell--expand">
            {(p.expandRender || fr.hasChildren) && (
              <button
                type="button"
                className={['cf-table__expand-btn', p.expanded ? 'is-open' : ''].filter(Boolean).join(' ')}
                aria-expanded={p.expanded}
                onClick={(e) => {
                  e.stopPropagation();
                  p.toggleExpand(fr.key);
                }}
              >
                <svg viewBox="0 0 12 12" width={10} height={10} aria-hidden>
                  <path
                    d="M3 4l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </td>
        )}
        {cols.map((col, ci) => (
          <td
            key={col.key}
            className={[
              'cf-table__cell',
              p.alignClass(col),
              p.fixedClass(col),
              col.ellipsis ? 'cf-table__cell--ellipsis' : '',
              p.cellClassOf(row, col, fr.index),
            ]
              .filter(Boolean)
              .join(' ')}
            style={p.fixedStyle(col)}
          >
            {ci === 0 && fr.level > 0 && (
              <span
                className="cf-table__tree-indent"
                style={{ paddingLeft: `${fr.level * p.treeIndent}px` }}
              />
            )}
            {p.renderCell?.[col.key]
              ? p.renderCell[col.key]({
                  row,
                  index: fr.index,
                  value: getCellValue(row, col),
                })
              : p.cellOf(row, col, fr.index)}
          </td>
        ))}
      </tr>
      {p.expandable && p.expandRender && p.expanded && !fr.hasChildren && (
        <tr className="cf-table__row cf-table__row--expand">
          <td
            className="cf-table__cell cf-table__expand-content"
            colSpan={cols.length + (p.selectable === 'multiple' ? 1 : 0) + 1}
          >
            {p.expandRender(row, fr.index) as ReactNode}
          </td>
        </tr>
      )}
    </>
  );
}
