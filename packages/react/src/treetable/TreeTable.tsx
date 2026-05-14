import { useMemo, useState, type CSSProperties } from 'react';
import {
  defaultRowKey,
  flattenTree,
  type TreeTableColumn,
  type TreeTableProps,
} from './variants';

export function TreeTable<T extends Record<string, unknown>>(props: TreeTableProps<T>) {
  const {
    data,
    columns,
    childrenKey = 'children',
    defaultExpandedKeys = [],
    rowKey = defaultRowKey,
    indentSize = 16,
    striped = true,
    size = 'md',
    onRowClick,
    onExpand,
  } = props;

  const [expanded, setExpanded] = useState(() => new Set(defaultExpandedKeys));

  const flatRows = useMemo(
    () => flattenTree(data, childrenKey, expanded, rowKey),
    [data, childrenKey, expanded, rowKey],
  );

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onExpand?.(id, next.has(id));
      return next;
    });
  }

  function cellValue(col: TreeTableColumn<T>, row: T) {
    if (col.accessor) return col.accessor(row);
    return (row as Record<string, unknown>)[col.key];
  }

  function widthStyle(col: TreeTableColumn<T>): CSSProperties {
    if (col.width == null) return {};
    return { width: typeof col.width === 'number' ? `${col.width}px` : col.width };
  }

  return (
    <div
      className={['cf-treetable', `cf-treetable--${size}`, striped ? 'is-striped' : ''].filter(Boolean).join(' ')}
      role="treegrid"
    >
      <div className="cf-treetable__head" role="row">
        {columns.map((col) => (
          <div
            key={col.key}
            className="cf-treetable__cell cf-treetable__head-cell"
            style={widthStyle(col)}
            data-align={col.align ?? 'left'}
            role="columnheader"
          >
            {col.label}
          </div>
        ))}
      </div>
      <div className="cf-treetable__body">
        {flatRows.map((flat) => (
          <div
            key={flat.id}
            className="cf-treetable__row"
            data-depth={flat.depth}
            role="row"
            aria-level={flat.depth + 1}
            aria-expanded={flat.hasChildren ? flat.expanded : undefined}
            onClick={() => onRowClick?.(flat.row, flat)}
          >
            {columns.map((col, ci) => {
              const value = cellValue(col, flat.row);
              return (
                <div
                  key={col.key}
                  className="cf-treetable__cell"
                  style={widthStyle(col)}
                  data-align={col.align ?? 'left'}
                  role="gridcell"
                >
                  {ci === 0 && (
                    <span
                      className="cf-treetable__indent"
                      style={{ paddingLeft: `${flat.depth * indentSize}px` }}
                    />
                  )}
                  {ci === 0 && flat.hasChildren && (
                    <button
                      type="button"
                      className={['cf-treetable__chevron', flat.expanded ? 'is-open' : ''].filter(Boolean).join(' ')}
                      aria-label={flat.expanded ? '折叠' : '展开'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(flat.id);
                      }}
                    >
                      <svg viewBox="0 0 12 12" width={10} height={10}>
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  {ci === 0 && !flat.hasChildren && <span className="cf-treetable__leaf-spacer" />}
                  {col.render ? (
                    col.render(value, flat.row, flat)
                  ) : (
                    <span className="cf-treetable__cell-text">{String(value ?? '')}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
