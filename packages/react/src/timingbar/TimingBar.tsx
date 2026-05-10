import { useMemo } from 'react';
import { linearScale } from '../_charts/scale';
import type { TimingBarProps } from './variants';

export function TimingBar(props: TimingBarProps) {
  const {
    phases,
    width = 480,
    height = 28,
    showAxis = true,
    labelMode = 'auto',
    ariaLabel = '请求瀑布图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!phases?.length) return null;
    const min = Math.min(...phases.map((p) => p.start));
    const max = Math.max(...phases.map((p) => p.end));
    const sx = linearScale({ min, max }, { start: 0, end: width });
    let lastLabelEnd = -Infinity;
    return phases.map((p, i) => {
      const x = sx(p.start);
      const segmentWidth = Math.max(1, sx(p.end) - sx(p.start));
      const duration = p.end - p.start;
      const text = `${p.label} ${duration}ms`;
      const estimatedTextWidth = text.length * 7 + 10;
      const autoVisible = segmentWidth >= estimatedTextWidth && x >= lastLabelEnd + 8;
      const labelVisible =
        labelMode === 'all' || (labelMode === 'auto' && autoVisible);
      if (labelVisible) lastLabelEnd = x + estimatedTextWidth;
      return {
        label: p.label,
        text,
        x,
        width: segmentWidth,
        colorIndex: p.colorIndex ?? i % 8,
        duration,
        labelVisible,
      };
    });
  }, [phases, width, labelMode]);

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
        >
          <title>
            {p.label}: {p.duration}ms
          </title>
        </rect>
      ))}
      {showAxis
        ? layout
            ?.filter((p) => labelMode !== 'none' && p.labelVisible)
            .map((p, i) => (
            <text key={`l${i}`} x={p.x + 4} y={height + 12}>
              {p.text}
            </text>
          ))
        : null}
    </svg>
  );
}
