import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { pivotCompute, type PivotProps } from './variants';

export function Pivot<T extends Record<string, unknown> = Record<string, unknown>>(
  props: PivotProps<T>,
): ReactNode {
  const {
    data,
    rowField,
    colField,
    valueField,
    aggregator = 'sum',
    format,
    showTotals = true,
    caption,
    size = 'md',
    heatmap = false,
    heatmapColor,
    onCellClick,
  } = props;

  const result = useMemo(
    () =>
      pivotCompute(
        data,
        rowField as string,
        colField as string,
        valueField as string | undefined,
        aggregator,
      ),
    [data, rowField, colField, valueField, aggregator],
  );

  function formatCell(value: number | undefined, row: string, col: string): string {
    if (value === undefined) return '';
    if (format) return format(value, { row, col });
    if (Number.isInteger(value)) return value.toLocaleString();
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function heatStyle(value: number | undefined): CSSProperties {
    if (!heatmap || value === undefined) return {};
    const span = result.max - result.min || 1;
    const t = (value - result.min) / span;
    const alpha = 0.05 + t * 0.4;
    const base = heatmapColor ?? 'var(--accent-1)';
    return { background: `color-mix(in oklch, ${base} ${alpha * 100}%, transparent)` };
  }

  return (
    <div className={`cf-pivot cf-pivot--${size}`}>
      {caption && <p className="cf-pivot__caption">{caption}</p>}
      <div className="cf-pivot__scroll">
        <table className="cf-pivot__table">
          <thead>
            <tr>
              <th className="cf-pivot__corner">
                <span className="cf-pivot__corner-row">{String(rowField)}</span>
                <span className="cf-pivot__corner-sep">/</span>
                <span className="cf-pivot__corner-col">{String(colField)}</span>
              </th>
              {result.colKeys.map((c) => (
                <th key={c} className="cf-pivot__th cf-pivot__th--col" scope="col">
                  {c}
                </th>
              ))}
              {showTotals && (
                <th className="cf-pivot__th cf-pivot__th--total" scope="col">
                  合计
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {result.rowKeys.map((r) => (
              <tr key={r}>
                <th className="cf-pivot__th cf-pivot__th--row" scope="row">
                  {r}
                </th>
                {result.colKeys.map((c) => {
                  const value = result.cells[r][c];
                  const cls =
                    'cf-pivot__cell' +
                    (value === undefined ? ' is-empty' : '') +
                    (onCellClick ? ' is-clickable' : '');
                  return (
                    <td
                      key={c}
                      className={cls}
                      style={heatStyle(value)}
                      onClick={() =>
                        onCellClick?.({
                          row: r,
                          col: c,
                          value: value ?? 0,
                          rows: result.raw[r]?.[c] ?? [],
                        })
                      }
                    >
                      {formatCell(value, r, c)}
                    </td>
                  );
                })}
                {showTotals && (
                  <td className="cf-pivot__cell cf-pivot__cell--total">
                    {formatCell(result.rowTotals[r], r, '__total__')}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {showTotals && (
            <tfoot>
              <tr>
                <th
                  className="cf-pivot__th cf-pivot__th--row cf-pivot__th--total"
                  scope="row"
                >
                  合计
                </th>
                {result.colKeys.map((c) => (
                  <td key={c} className="cf-pivot__cell cf-pivot__cell--total">
                    {formatCell(result.colTotals[c], '__total__', c)}
                  </td>
                ))}
                <td className="cf-pivot__cell cf-pivot__cell--grand">
                  {formatCell(result.grandTotal, '__total__', '__total__')}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
