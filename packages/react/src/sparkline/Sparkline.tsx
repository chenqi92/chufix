import { useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type { SparklineProps } from './variants';

export function Sparkline(props: SparklineProps) {
  const {
    data,
    width = 80,
    height = 24,
    filled = false,
    smooth = false,
    colorIndex = 0,
    showDot = true,
    interactive = false,
    format,
    labels,
    ariaLabel = '走势缩略图',
    className,
    onClick,
    onHover,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const svg = useMemo(() => {
    if (!data?.length) return null;
    const dom = domainOf(data);
    const sx = linearScale(
      { min: 0, max: Math.max(1, data.length - 1) },
      { start: 1, end: width - 1 },
    );
    const sy = linearScale(dom, { start: height - 1, end: 1 });
    const points = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return {
      line: linePath(points, smooth),
      area: areaPath(points, height - 1),
      last: points[points.length - 1],
      points,
    };
  }, [data, width, height, smooth]);

  const cls = [
    'cf-sparkline',
    `cf-chart__series-${colorIndex}`,
    interactive ? 'is-interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function nearestIndex(clientX: number, target: SVGSVGElement | null): number {
    if (!data?.length || !target) return 0;
    const rect = target.getBoundingClientRect();
    const ratio = rect.width ? (clientX - rect.left) / rect.width : 0;
    return Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1))));
  }

  function fmt(value: number, index: number): string {
    if (format) return format(value, index);
    if (Number.isInteger(value)) return value.toLocaleString();
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const hoverPoint = (() => {
    if (!interactive || hoverIndex == null || !svg) return null;
    return svg.points[hoverIndex];
  })();

  const hoverLabel = (() => {
    if (hoverIndex == null || !data?.length) return '';
    const v = data[hoverIndex];
    const label = labels?.[hoverIndex];
    return label ? `${label} · ${fmt(v, hoverIndex)}` : fmt(v, hoverIndex);
  })();

  const tooltipStyle: CSSProperties = (() => {
    if (!hoverPoint) return { display: 'none' };
    const x = hoverPoint.x;
    const half = width / 2;
    const isLeftHalf = x < half;
    return {
      left: isLeftHalf ? `${x + 6}px` : 'auto',
      right: isLeftHalf ? 'auto' : `${width - x + 6}px`,
      top: '0px',
    };
  })();

  return (
    <span className="cf-sparkline-wrap">
      <svg
        ref={svgRef}
        className={cls}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        onClick={(ev) => {
          if (!data?.length) return;
          const dataIndex = nearestIndex(ev.clientX, ev.currentTarget);
          onClick?.({ dataIndex, value: data[dataIndex], nativeEvent: ev.nativeEvent });
        }}
        onPointerMove={(ev) => {
          if (!interactive || !data?.length) return;
          const dataIndex = nearestIndex(ev.clientX, ev.currentTarget);
          setHoverIndex(dataIndex);
          onHover?.({
            dataIndex,
            value: data[dataIndex],
            label: labels?.[dataIndex],
            nativeEvent: ev.nativeEvent,
          });
        }}
        onPointerLeave={() => {
          if (!interactive) return;
          setHoverIndex(null);
          onHover?.(null);
        }}
      >
        {svg ? (
          <>
            {filled ? <path className="cf-chart__area" d={svg.area} /> : null}
            <path className="cf-chart__line" d={svg.line} />
            {showDot ? (
              <circle
                className="cf-chart__dot"
                cx={svg.last.x}
                cy={svg.last.y}
                r={2}
              />
            ) : null}
            {hoverPoint ? (
              <>
                <line
                  className="cf-sparkline__crosshair"
                  x1={hoverPoint.x}
                  x2={hoverPoint.x}
                  y1={1}
                  y2={height - 1}
                />
                <circle
                  className="cf-sparkline__hover-dot"
                  cx={hoverPoint.x}
                  cy={hoverPoint.y}
                  r={3}
                />
              </>
            ) : null}
          </>
        ) : null}
      </svg>
      {interactive && hoverPoint ? (
        <span
          className="cf-sparkline__tooltip"
          style={tooltipStyle}
          role="status"
          aria-live="polite"
        >
          {hoverLabel}
        </span>
      ) : null}
    </span>
  );
}
