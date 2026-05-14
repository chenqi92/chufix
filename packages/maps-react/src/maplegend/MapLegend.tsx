import type { MapLegendProps } from './variants';

export function MapLegend(props: MapLegendProps) {
  const {
    kind = 'color',
    gradient,
    domain,
    stops,
    title,
    unit,
    position = 'bottom-right',
    inline = false,
  } = props;

  const isStepped = !!stops?.length;
  const cls = [
    'cf-maplegend',
    `cf-maplegend--${kind}`,
    inline ? 'cf-maplegend--inline' : `cf-maplegend--corner cf-maplegend--${position}`,
  ].join(' ');

  function fmt(v: number | string) {
    return typeof v === 'number' ? String(v) + (unit ?? '') : v + (unit ?? '');
  }

  return (
    <div className={cls}>
      {title && <div className="cf-maplegend__title">{title}</div>}

      {isStepped && (
        <ul className="cf-maplegend__list">
          {stops!.map((s, i) => (
            <li key={i} className="cf-maplegend__item">
              {kind === 'color' ? (
                <span className="cf-maplegend__swatch" style={{ background: String(s.swatch) }} />
              ) : (
                <span
                  className="cf-maplegend__bubble"
                  style={{
                    width: `${(typeof s.swatch === 'number' ? s.swatch : 8) * 2}px`,
                    height: `${(typeof s.swatch === 'number' ? s.swatch : 8) * 2}px`,
                  }}
                />
              )}
              <span className="cf-maplegend__label">{s.label ?? fmt(s.value)}</span>
            </li>
          ))}
        </ul>
      )}

      {!isStepped && kind === 'color' && gradient && gradient.length > 0 && (
        <div className="cf-maplegend__bar">
          {gradient.map((s, i) => (
            <span
              key={i}
              className="cf-maplegend__bar-stop"
              style={{ left: `${s.offset * 100}%`, background: s.color }}
            />
          ))}
        </div>
      )}

      {!isStepped && kind === 'size' && domain && (
        <div className="cf-maplegend__size-row">
          <span className="cf-maplegend__bubble" style={{ width: '8px', height: '8px' }} />
          <span className="cf-maplegend__bubble" style={{ width: '16px', height: '16px' }} />
          <span className="cf-maplegend__bubble" style={{ width: '24px', height: '24px' }} />
        </div>
      )}

      {domain && !isStepped && (
        <div className="cf-maplegend__range">
          <span>{fmt(domain[0])}</span>
          <span>{fmt(domain[1])}</span>
        </div>
      )}
    </div>
  );
}
