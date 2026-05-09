import { useEffect, useMemo, useRef, useState } from 'react';
import {
  compareCells,
  getCellValue,
  getRowKey,
  nextSortDirection,
  tableClass,
  type TableColumn,
  type TableProps,
  type TableSort,
} from './variants';

export function Table<T extends Record<string, unknown> = Record<string, unknown>>(
  props: TableProps<T>,
) {
  const {
    columns,
    rows,
    rowKey,
    size = 'md',
    variant = 'default',
    hoverable = true,
    emptyText = '暂无数据',
    loading = false,
    sort,
    defaultSort,
    selectable,
    value,
    defaultValue,
    className,
    onSortChange,
    onChange,
    onRowClick,
  } = props;

  const isSortControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<TableSort | null>(defaultSort ?? null);
  const activeSort = isSortControlled ? (sort ?? null) : internalSort;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | string[] | null>(
    defaultValue ?? (selectable === 'multiple' ? [] : null),
  );
  const current = isControlled ? value : internal;

  const sortedRows = useMemo(() => {
    if (!activeSort || !activeSort.direction) return rows;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col || !col.sortable) return rows;
    const sign = activeSort.direction === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => sign * compareCells(getCellValue(a, col), getCellValue(b, col)),
    );
  }, [rows, columns, activeSort]);

  function handleSort(col: TableColumn<T>) {
    if (!col.sortable) return;
    let next: TableSort | null;
    if (activeSort?.key === col.key) {
      const dir = nextSortDirection(activeSort.direction);
      next = dir ? { key: col.key, direction: dir } : null;
    } else {
      next = { key: col.key, direction: 'asc' };
    }
    if (!isSortControlled) setInternalSort(next);
    onSortChange?.(next);
  }

  const selectedSet = useMemo(() => {
    if (selectable === 'multiple') {
      return new Set(Array.isArray(current) ? current : []);
    }
    if (selectable === 'single') {
      return new Set(current ? [current as string] : []);
    }
    return new Set<string>();
  }, [current, selectable]);

  const allKeys = useMemo(
    () => sortedRows.map((row, i) => getRowKey(row, i, rowKey)),
    [sortedRows, rowKey],
  );

  const allSelected =
    selectable === 'multiple' &&
    !!sortedRows.length &&
    allKeys.every((k) => selectedSet.has(k));

  const indeterminate =
    selectable === 'multiple' && !allSelected && selectedSet.size > 0;

  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function commit(next: string | string[] | null) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function toggleRow(key: string) {
    if (selectable === 'single') {
      commit(key);
      return;
    }
    if (selectable !== 'multiple') return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    commit(Array.from(next));
  }

  function toggleAll() {
    if (selectable !== 'multiple') return;
    commit(allSelected ? [] : allKeys);
  }

  const cls = tableClass({ size, variant, hoverable, loading, className });

  function colStyle(col: TableColumn<T>) {
    return col.width != null
      ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
      : undefined;
  }

  function alignClass(col: TableColumn<T>) {
    return col.align ? `cf-table__cell--${col.align}` : '';
  }

  function sortDir(key: string) {
    return activeSort?.key === key ? activeSort.direction : null;
  }

  return (
    <div className={cls}>
      <div className="cf-table__scroll">
        <table className="cf-table__table">
          <colgroup>
            {selectable === 'multiple' ? <col style={{ width: 36 }} /> : null}
            {columns.map((col) => (
              <col key={col.key} style={colStyle(col)} />
            ))}
          </colgroup>
          <thead className="cf-table__head">
            <tr>
              {selectable === 'multiple' ? (
                <th className="cf-table__cell cf-table__cell--check">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allSelected}
                    aria-label="全选"
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((col) => {
                const dir = sortDir(col.key);
                const thCls = [
                  'cf-table__cell',
                  'cf-table__cell--th',
                  alignClass(col),
                  col.sortable && 'is-sortable',
                  activeSort?.key === col.key && 'is-sorted',
                ].filter(Boolean).join(' ');
                return (
                  <th
                    key={col.key}
                    className={thCls}
                    onClick={() => handleSort(col)}
                  >
                    <span className="cf-table__th-label">
                      {col.title}
                      {col.sortable ? (
                        <svg
                          className={`cf-table__sort is-${dir ?? 'idle'}`}
                          viewBox="0 0 12 12"
                          aria-hidden="true"
                        >
                          <path d="M6 2l3 3H3z" fill="currentColor" />
                          <path d="M6 10L3 7h6z" fill="currentColor" />
                        </svg>
                      ) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="cf-table__body">
            {!sortedRows.length ? (
              <tr className="cf-table__row cf-table__row--empty">
                <td
                  className="cf-table__cell"
                  colSpan={columns.length + (selectable === 'multiple' ? 1 : 0)}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, i) => {
                const key = getRowKey(row, i, rowKey);
                const sel = selectedSet.has(key);
                const trCls = [
                  'cf-table__row',
                  sel && 'is-selected',
                  selectable && 'is-clickable',
                ].filter(Boolean).join(' ');
                return (
                  <tr
                    key={key}
                    className={trCls}
                    onClick={() => {
                      if (selectable) toggleRow(key);
                      else onRowClick?.(row, i);
                    }}
                  >
                    {selectable === 'multiple' ? (
                      <td className="cf-table__cell cf-table__cell--check">
                        <input
                          type="checkbox"
                          checked={sel}
                          aria-label={`选中第 ${i + 1} 行`}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleRow(key)}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => {
                      const v = getCellValue(row, col);
                      const display = col.render
                        ? col.render(v, row, i)
                        : col.format
                          ? col.format(v, row, i)
                          : (v as React.ReactNode);
                      return (
                        <td
                          key={col.key}
                          className={`cf-table__cell ${alignClass(col)}`}
                        >
                          {display as React.ReactNode}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
