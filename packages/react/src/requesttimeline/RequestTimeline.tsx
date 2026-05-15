import { useMemo, type CSSProperties } from 'react';
import {
  type RequestTiming,
  PHASE_COLOR,
  formatTime,
  pickGridStep,
  totalRange,
} from './variants';

export interface RequestTimelineProps {
  requests: RequestTiming[];
  unit?: 'ms' | 's';
  rowHeight?: number;
  labelWidth?: number;
  showGrid?: boolean;
  className?: string;
  onSelect?: (request: RequestTiming) => void;
}

function phaseSegments(r: RequestTiming) {
  if (!r.phases || r.phases.length === 0) {
    return [{ type: 'wait' as const, leftPct: 0, widthPct: 100 }];
  }
  const total = r.phases.reduce((s, p) => s + p.duration, 0) || 1;
  let cursor = 0;
  return r.phases.map((p) => {
    const leftPct = (cursor / total) * 100;
    const widthPct = (p.duration / total) * 100;
    cursor += p.duration;
    return { type: p.type, leftPct, widthPct };
  });
}

export function RequestTimeline({
  requests,
  unit = 'ms',
  rowHeight = 22,
  labelWidth = 220,
  showGrid = true,
  className,
  onSelect,
}: RequestTimelineProps) {
  const range = useMemo(() => totalRange(requests), [requests]);
  const span = Math.max(1, range.max - range.min);
  const gridStep = pickGridStep(span);
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let v = 0; v <= span; v += gridStep) out.push(v);
    return out;
  }, [span, gridStep]);

  const wrapStyle: CSSProperties = {
    ['--cf-reqt-label-width' as string]: `${labelWidth}px`,
  };
  const rowsStyle: CSSProperties = {
    ['--cf-reqt-row-height' as string]: `${rowHeight}px`,
  };
  const gridBgStyle = (): CSSProperties => ({
    backgroundImage: 'linear-gradient(to right, var(--line-1) 1px, transparent 1px)',
    backgroundSize: `${(gridStep / span) * 100}% 100%`,
  });

  return (
    <div className={['cf-reqt', className].filter(Boolean).join(' ')} style={wrapStyle}>
      {showGrid && (
        <div className="cf-reqt__axis">
          <div className="cf-reqt__axis-label" />
          <div className="cf-reqt__axis-grid">
            {ticks.map((t, i) => (
              <span
                key={i}
                className="cf-reqt__tick"
                style={{ left: `${(t / span) * 100}%` }}
              >
                {formatTime(t, unit)}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="cf-reqt__rows" style={rowsStyle}>
        {requests.map((r) => {
          const left = ((r.start - range.min) / span) * 100;
          const width = Math.max(0.1, ((r.end - r.start) / span) * 100);
          return (
            <div key={r.id} className="cf-reqt__row" onClick={() => onSelect?.(r)}>
              <div className="cf-reqt__label" title={r.label}>{r.label}</div>
              <div className="cf-reqt__track">
                {showGrid && <div className="cf-reqt__grid" style={gridBgStyle()} />}
                <div
                  className={['cf-reqt__bar', r.tone && `cf-reqt__bar--${r.tone}`].filter(Boolean).join(' ')}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {phaseSegments(r).map((seg, i) => (
                    <span
                      key={i}
                      className="cf-reqt__seg"
                      style={{
                        left: `${seg.leftPct}%`,
                        width: `${seg.widthPct}%`,
                        background: PHASE_COLOR[seg.type],
                      }}
                      title={seg.type}
                    />
                  ))}
                </div>
                <span className="cf-reqt__duration">
                  {formatTime(r.end - r.start, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
