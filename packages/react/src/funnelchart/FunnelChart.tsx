import { useMemo } from 'react';
import type { FunnelChartProps } from './variants';

export function FunnelChart(props: FunnelChartProps) {
  const {
    steps,
    width = 360,
    height = 240,
    showLabels = true,
    ariaLabel = '漏斗图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    if (!steps?.length) return null;
    const max = Math.max(...steps.map((s) => s.value), 1);
    const stepH = height / steps.length;
    return steps.map((s, i) => {
      const wTop = ((steps[Math.max(0, i - 1)]?.value ?? max) / max) * width;
      const wBot = (s.value / max) * width;
      const next = steps[i + 1];
      const wNextBot = next ? (next.value / max) * width : wBot;
      const top = i * stepH;
      const bot = (i + 1) * stepH;
      const tlX = (width - wTop) / 2;
      const trX = width - tlX;
      const blX = (width - wNextBot) / 2;
      const brX = width - blX;
      return {
        d: `M ${tlX} ${top} L ${trX} ${top} L ${brX} ${bot} L ${blX} ${bot} Z`,
        label: s.label,
        value: s.value,
        cx: width / 2,
        cy: top + stepH / 2,
        colorIndex: i % 8,
      };
    });
  }, [steps, width, height]);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.map((s, i) => (
        <path
          key={i}
          className={`cf-chart__bar--${s.colorIndex}`}
          d={s.d}
          opacity={0.9}
          onPointerEnter={(e) => {
            const step = steps?.[i];
            if (step) onItemEnter?.({ step, dataIndex: i, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const step = steps?.[i];
            if (step) onItemLeave?.({ step, dataIndex: i, nativeEvent: e });
          }}
        />
      ))}
      {showLabels
        ? layout?.map((s, i) => (
            <text
              key={`l${i}`}
              x={s.cx}
              y={s.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--fg-on-viz)"
            >
              {s.label} · {s.value}
            </text>
          ))
        : null}
    </svg>
  );
}
