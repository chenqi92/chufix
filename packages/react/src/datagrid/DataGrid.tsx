import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  compareCells,
  getCellValue,
  getRowKey,
  nextSortDirection,
  type TableSort,
} from '../table/variants';
import type {
  DataGridColumn,
  DataGridProps,
} from './variants';

export function DataGrid<T extends Record<string, unknown> = Record<string, unknown>>(
  props: DataGridProps<T>,
) {
  const {
    columns,
    rows,
    rowKey,
    size = 'md',
    hoverable = true,
    emptyText = '暂无数据',
    loading = false,
    selectable,
    value,
    defaultValue,
    maxHeight,
    className,
    onChange,
    onCellEdit,
    onColumnResize,
  } = props;

  const [widths, setWidths] = useState<Record<string, number>>(
    Object.fromEntries(
      columns
        .filter((c) => typeof c.width === 'number')
        .map((c) => [c.key, c.width as number]),
    ),
  );
  const [sort, setSort] = useState<TableSort | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | string[] | null>(
    defaultValue ?? (selectable === 'multiple' ? [] : null),
  );
  const current = isControlled ? value : internal;

  const sortedRows = useMemo(() => {
    if (!sort || !sort.direction) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortable) return rows;
    const sign = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => sign * compareCells(getCellValue(a, col), getCellValue(b, col)),
    );
  }, [rows, columns, sort]);

  function handleSort(col: DataGridColumn<T>) {
    if (!col.sortable) return;
    if (sort?.key === col.key) {
      const dir = nextSortDirection(sort.direction);
      setSort(dir ? { key: col.key, direction: dir } : null);
    } else {
      setSort({ key: col.key, direction: 'asc' });
    }
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

  function colWidthStyle(col: DataGridColumn<T>): CSSProperties | undefined {
    const w = widths[col.key] ?? col.width;
    if (w == null) return undefined;
    return { width: typeof w === 'number' ? `${w}px` : w };
  }

  function startResize(col: DataGridColumn<T>, e: ReactPointerEvent<HTMLSpanElement>) {
    if (!col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget;
    const startX = e.clientX;
    const th = target.parentElement as HTMLElement;
    const startWidth = th.getBoundingClientRect().width;
    target.setPointerCapture(e.pointerId);

    function onMove(ev: globalThis.PointerEvent) {
      const next = Math.max(col.minWidth ?? 60, startWidth + ev.clientX - startX);
      setWidths((w) => ({ ...w, [col.key]: next }));
    }
    function onUp(ev: globalThis.PointerEvent) {
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
      onColumnResize?.(col, widths[col.key]);
    }
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  }

  function cellId(rk: string, ck: string) {
    return `${rk}::${ck}`;
  }

  function startEdit(row: T, rowIndex: number, col: DataGridColumn<T>) {
    if (!col.editable) return;
    const rk = getRowKey(row, rowIndex, rowKey);
    setEditingKey(cellId(rk, col.key));
    setDraftValue(String(getCellValue(row, col) ?? ''));
  }

  function commitEdit(row: T, rowIndex: number, col: DataGridColumn<T>) {
    if (!editingKey) return;
    onCellEdit?.({
      row,
      rowIndex,
      column: col,
      value: draftValue,
      previous: getCellValue(row, col),
    });
    setEditingKey(null);
    setDraftValue('');
  }

  function cancelEdit() {
    setEditingKey(null);
    setDraftValue('');
  }

  function onCellKeydown(
    e: KeyboardEvent<HTMLInputElement>,
    row: T,
    rowIndex: number,
    col: DataGridColumn<T>,
  ) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(row, rowIndex, col);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }

  const editInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editingKey && editInputRef.current) editInputRef.current.focus();
  }, [editingKey]);

  const cls = [
    'cf-datagrid',
    `cf-datagrid--${size}`,
    hoverable && 'is-hoverable',
    loading && 'is-loading',
    className,
  ].filter(Boolean).join(' ');

  const scrollStyle: CSSProperties | undefined =
    maxHeight != null
      ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
      : undefined;

  return (
    <div className={cls}>
      <div className="cf-datagrid__scroll" style={scrollStyle}>
        <table className="cf-datagrid__table">
          <colgroup>
            {selectable === 'multiple' ? <col style={{ width: 36 }} /> : null}
            {columns.map((col) => (
              <col key={col.key} style={colWidthStyle(col)} />
            ))}
          </colgroup>
          <thead className="cf-datagrid__head">
            <tr>
              {selectable === 'multiple' ? (
                <th className="cf-datagrid__cell cf-datagrid__cell--th cf-datagrid__cell--check" />
              ) : null}
              {columns.map((col) => {
                const dir = sort?.key === col.key ? sort.direction : null;
                const thCls = [
                  'cf-datagrid__cell',
                  'cf-datagrid__cell--th',
                  col.align && `cf-datagrid__cell--${col.align}`,
                  col.sortable && 'is-sortable',
                  sort?.key === col.key && 'is-sorted',
                ].filter(Boolean).join(' ');
                return (
                  <th
                    key={col.key}
                    className={thCls}
                    onClick={() => handleSort(col)}
                  >
                    <span className="cf-datagrid__th-label">
                      {col.title}
                      {col.sortable ? (
                        <svg
                          className={`cf-datagrid__sort is-${dir ?? 'idle'}`}
                          viewBox="0 0 12 12"
                          aria-hidden="true"
                        >
                          <path d="M6 2l3 3H3z" fill="currentColor" />
                          <path d="M6 10L3 7h6z" fill="currentColor" />
                        </svg>
                      ) : null}
                    </span>
                    {col.resizable ? (
                      <span
                        className="cf-datagrid__resize"
                        onPointerDown={(e) => startResize(col, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="cf-datagrid__body">
            {!sortedRows.length ? (
              <tr className="cf-datagrid__row cf-datagrid__row--empty">
                <td
                  className="cf-datagrid__cell"
                  colSpan={columns.length + (selectable === 'multiple' ? 1 : 0)}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, i) => {
                const rk = getRowKey(row, i, rowKey);
                const sel = selectedSet.has(rk);
                const trCls = [
                  'cf-datagrid__row',
                  sel && 'is-selected',
                  selectable && 'is-clickable',
                ].filter(Boolean).join(' ');
                return (
                  <tr
                    key={rk}
                    className={trCls}
                    onClick={() => selectable && toggleRow(rk)}
                  >
                    {selectable === 'multiple' ? (
                      <td className="cf-datagrid__cell cf-datagrid__cell--check">
                        <input
                          type="checkbox"
                          checked={sel}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleRow(rk)}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => {
                      const editing = editingKey === cellId(rk, col.key);
                      const tdCls = [
                        'cf-datagrid__cell',
                        col.align && `cf-datagrid__cell--${col.align}`,
                        col.editable && 'is-editable',
                      ].filter(Boolean).join(' ');
                      const v = getCellValue(row, col);
                      const display = col.render
                        ? col.render(v, row, i)
                        : col.format
                          ? col.format(v, row, i)
                          : (v as React.ReactNode);
                      return (
                        <td
                          key={col.key}
                          className={tdCls}
                          onDoubleClick={() => startEdit(row, i, col)}
                        >
                          {editing ? (
                            <input
                              ref={editInputRef}
                              className="cf-datagrid__edit"
                              value={draftValue}
                              onChange={(e) => setDraftValue(e.target.value)}
                              onBlur={() => commitEdit(row, i, col)}
                              onKeyDown={(e) => onCellKeydown(e, row, i, col)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            (display as React.ReactNode)
                          )}
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
