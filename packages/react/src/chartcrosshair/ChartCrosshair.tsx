import type { ChartCrosshairProps } from './variants';

export function ChartCrosshair(props: ChartCrosshairProps) {
  const {
    visible = true,
    x,
    y,
    width,
    height,
    showVertical = true,
    showHorizontal = false,
    tooltip,
  } = props;

  if (!visible || x == null) return null;

  return (
    <g className="cf-crosshair" pointerEvents="none">
      {showVertical ? (
        <line
          className="cf-crosshair__line"
          x1={x}
          x2={x}
          y1={0}
          y2={height}
        />
      ) : null}
      {showHorizontal && y != null ? (
        <line
          className="cf-crosshair__line"
          x1={0}
          x2={width}
          y1={y}
          y2={y}
        />
      ) : null}
      {tooltip && y != null ? (
        <g
          className="cf-crosshair__tip"
          transform={`translate(${x + 6} ${y - 18})`}
        >
          <rect width={80} height={22} rx={3} />
          <text x={6} y={14}>
            {tooltip}
          </text>
        </g>
      ) : null}
    </g>
  );
}
