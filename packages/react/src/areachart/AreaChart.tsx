import { useMemo } from 'react';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type { AreaChartProps } from './variants';

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;

export function AreaChart(props: AreaChartProps) {
  const {
    series,
    width = 480,
    height = 240,
    smooth = false,
    stacked = false,
    ariaLabel = '面积图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!series?.length) return null;
    const maxLen = Math.max(...series.map((s) => s.data.length), 1);

    let stackedData: number[][];
    if (stacked) {
      stackedData = series.map(() => new Array(maxLen).fill(0));
      for (let i = 0; i < maxLen; i++) {
        let acc = 0;
        for (let s = 0; s < series.length; s++) {
          acc += series[s].data[i] ?? 0;
          stackedData[s][i] = acc;
        }
      }
    } else {
      stackedData = series.map((s) => s.data.slice());
    }

    const allValues = stackedData.flat();
    const dom = domainOf(stacked ? [0, ...allValues] : allValues);
    const sx = linearScale(
      { min: 0, max: Math.max(1, maxLen - 1) },
      { start: padLeft, end: width - padRight },
    );
    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const baselineY = sy(dom.min);

    return stackedData.map((data, idx) => {
      const pts = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
      return {
        idx,
        area: areaPath(pts, baselineY),
        line: linePath(pts, smooth),
      };
    });
  }, [series, width, height, smooth, stacked]);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.map((a) => (
        <g key={a.idx} className={`cf-chart__series-${a.idx}`}>
          <path className="cf-chart__area" d={a.area} />
          <path className="cf-chart__line" d={a.line} />
        </g>
      ))}
    </svg>
  );
}
