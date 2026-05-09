import { useMemo } from 'react';
import { linearScale } from '../_charts/scale';
import type { TimingBarProps } from './variants';

export function TimingBar(props: TimingBarProps) {
  const {
    phases,
    width = 480,
    height = 28,
    showAxis = true,
    ariaLabel = '请求瀑布图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!phases?.length) return null;
    const min = Math.min(...phases.map((p) => p.start));
    const max = Math.max(...phases.map((p) => p.end));
    const sx = linearScale({ min, max }, { start: 0, end: width });
    return phases.map((p, i) => ({
      label: p.label,
      x: sx(p.start),
      width: Math.max(1, sx(p.end) - sx(p.start)),
      colorIndex: p.colorIndex ?? i % 8,
      duration: p.end - p.start,
    }));
  }, [phases, width]);

  const totalH = height + (showAxis ? 14 : 0);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${totalH}`}
      width={width}
      height={totalH}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.map((p, i) => (
        <rect
          key={i}
          className={`cf-chart__bar--${p.colorIndex}`}
          x={p.x}
          y={0}
          width={p.width}
          height={height}
        />
      ))}
      {showAxis
        ? layout?.map((p, i) => (
            <text key={`l${i}`} x={p.x + 4} y={height + 12}>
              {p.label} {p.duration}ms
            </text>
          ))
        : null}
    </svg>
  );
}
