import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { CandlestickChartProps } from './variants';

export function CandlestickChart(props: CandlestickChartProps) {
  const {
    data,
    width = 480,
    height = 240,
    ariaLabel = 'K 线图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const candles = useMemo(() => {
    if (!data?.length) return null;
    const all = data.flatMap((c) => [c.open, c.high, c.low, c.close]);
    const dom = domainOf(all);
    const sy = linearScale(dom, { start: height - 24, end: 12 });
    const innerW = width - 48;
    const slot = innerW / data.length;
    const candleW = Math.max(2, slot * 0.6);
    return data.map((c, i) => {
      const cx = 36 + slot * (i + 0.5);
      return {
        cx,
        candleW,
        yHigh: sy(c.high),
        yLow: sy(c.low),
        bodyTop: Math.min(sy(c.open), sy(c.close)),
        bodyHeight: Math.abs(sy(c.open) - sy(c.close)) || 1,
        up: c.close >= c.open,
      };
    });
  }, [data, width, height]);

  return (
    <svg
      className={['cf-chart cf-candlestick', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {candles?.map((c, i) => (
        <g
          key={i}
          className={c.up ? 'cf-candlestick__up' : 'cf-candlestick__down'}
          onPointerEnter={(e) => {
            const candle = data?.[i];
            if (candle) onItemEnter?.({ candle, dataIndex: i, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const candle = data?.[i];
            if (candle) onItemLeave?.({ candle, dataIndex: i, nativeEvent: e });
          }}
        >
          <line
            className="cf-candlestick__wick"
            x1={c.cx}
            x2={c.cx}
            y1={c.yHigh}
            y2={c.yLow}
          />
          <rect
            className="cf-candlestick__body"
            x={c.cx - c.candleW / 2}
            y={c.bodyTop}
            width={c.candleW}
            height={c.bodyHeight}
          />
        </g>
      ))}
    </svg>
  );
}
