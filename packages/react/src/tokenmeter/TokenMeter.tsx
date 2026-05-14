import { useMemo } from 'react';
import { formatTokens, ratioTone, type TokenMeterProps, type TokenMeterTone } from './variants';

export function TokenMeter(props: TokenMeterProps) {
  const {
    used,
    limit,
    segments,
    showLabel = true,
    showLegend = true,
    autoTone = true,
    compact = false,
  } = props;

  const ratio = limit > 0 ? used / limit : 0;
  const fallbackTone: TokenMeterTone = autoTone ? ratioTone(ratio) : 'accent';

  const renderedSegments = useMemo(() => {
    if (!segments?.length) {
      return [
        {
          label: '已用',
          value: used,
          tone: fallbackTone,
          widthPct: Math.max(0, Math.min(100, ratio * 100)),
        },
      ];
    }
    return segments.map((s) => ({
      label: s.label,
      value: s.value,
      tone: (s.tone ?? 'accent') as TokenMeterTone,
      widthPct: limit > 0 ? Math.max(0, (s.value / limit) * 100) : 0,
    }));
  }, [segments, used, limit, ratio, fallbackTone]);

  return (
    <div
      className={['cf-tokenmeter', compact ? 'cf-tokenmeter--compact' : ''].filter(Boolean).join(' ')}
      role="meter"
      aria-valuenow={used}
      aria-valuemax={limit}
    >
      {showLabel && (
        <div className="cf-tokenmeter__head">
          <span className="cf-tokenmeter__used">{formatTokens(used)}</span>
          <span className="cf-tokenmeter__sep">/</span>
          <span className="cf-tokenmeter__limit">{formatTokens(limit)} tokens</span>
        </div>
      )}
      <div className="cf-tokenmeter__bar">
        {renderedSegments.map((seg, i) => (
          <span
            key={i}
            className={`cf-tokenmeter__seg cf-tokenmeter__seg--${seg.tone}`}
            style={{ width: `${seg.widthPct}%` }}
            title={`${seg.label}: ${formatTokens(seg.value)}`}
          />
        ))}
      </div>
      {showLegend && segments && segments.length > 0 && !compact && (
        <div className="cf-tokenmeter__legend">
          {renderedSegments.map((seg, i) => (
            <span key={i} className="cf-tokenmeter__legend-item">
              <span className={`cf-tokenmeter__legend-dot cf-tokenmeter__seg--${seg.tone}`} />
              {seg.label} <span className="cf-tokenmeter__legend-value">{formatTokens(seg.value)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
