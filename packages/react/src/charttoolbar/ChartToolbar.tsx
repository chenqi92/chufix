import type { ChartToolbarProps } from './variants';

export function ChartToolbar(props: ChartToolbarProps) {
  const {
    title,
    subtitle,
    series,
    showZoom,
    showExport,
    showRefresh,
    onSeriesToggle,
    onAction,
    className,
  } = props;

  return (
    <header className={['cf-toolbar2', className].filter(Boolean).join(' ')}>
      <div className="cf-toolbar2__heading">
        {title ? <h3 className="cf-toolbar2__title">{title}</h3> : null}
        {subtitle ? <span className="cf-toolbar2__sub">{subtitle}</span> : null}
      </div>
      {series && series.length ? (
        <ul className="cf-toolbar2__legend">
          {series.map((s) => (
            <li
              key={s.name}
              className={['cf-toolbar2__legend-item', s.hidden && 'is-hidden']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSeriesToggle?.(s.name, s)}
            >
              <span
                className={`cf-toolbar2__dot cf-chart__bar--${s.colorIndex}`}
              />
              {s.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="cf-toolbar2__actions">
        {showZoom ? (
          <>
            <button
              type="button"
              className="cf-toolbar2__btn"
              title="放大"
              onClick={() => onAction?.('zoom-in')}
            >
              +
            </button>
            <button
              type="button"
              className="cf-toolbar2__btn"
              title="缩小"
              onClick={() => onAction?.('zoom-out')}
            >
              −
            </button>
          </>
        ) : null}
        {showExport ? (
          <button
            type="button"
            className="cf-toolbar2__btn"
            title="导出"
            onClick={() => onAction?.('export')}
          >
            ↓
          </button>
        ) : null}
        {showRefresh ? (
          <button
            type="button"
            className="cf-toolbar2__btn"
            title="刷新"
            onClick={() => onAction?.('refresh')}
          >
            ↻
          </button>
        ) : null}
      </div>
    </header>
  );
}
