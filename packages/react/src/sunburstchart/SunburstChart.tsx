import { useEffect, useMemo, useState } from 'react';
import { buildLayout, pathTo, sumValue } from './layout';
import type {
  SunburstChartProps,
  SunburstNode,
} from './variants';

export function SunburstChart(props: SunburstChartProps) {
  const {
    root,
    size = 240,
    innerRadiusRatio = 0.2,
    showLabels = true,
    labelMinAngle = 12,
    ariaLabel = '旭日图',
    drillable = true,
    showBreadcrumb = true,
    className,
    onItemEnter,
    onItemLeave,
    onDrill,
  } = props;

  const [stack, setStack] = useState<SunburstNode[]>([root]);
  useEffect(() => {
    setStack([root]);
  }, [root]);

  const focused = stack[stack.length - 1];
  const canDrillUp = stack.length > 1;

  const layout = useMemo(
    () => buildLayout(focused, { size, innerRadiusRatio }),
    [focused, size, innerRadiusRatio],
  );

  function labelXY(seg: { midAngle: number; midRadius: number }) {
    const a = ((seg.midAngle - 90) * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    return { x: cx + seg.midRadius * Math.cos(a), y: cy + seg.midRadius * Math.sin(a) };
  }

  function onSegmentClick(idx: number) {
    if (!drillable) return;
    const seg = layout.segments[idx];
    if (!seg || !seg.node.children?.length) return;
    const next = [...stack, seg.node];
    setStack(next);
    onDrill?.({ node: seg.node, pathNames: pathTo(root, seg.node) });
  }
  function drillTo(index: number) {
    if (!drillable) return;
    if (index === stack.length - 1) return;
    const next = stack.slice(0, index + 1);
    setStack(next);
    const node = next[next.length - 1];
    onDrill?.({ node, pathNames: pathTo(root, node) });
  }
  function drillUp() {
    if (!drillable || stack.length <= 1) return;
    drillTo(stack.length - 2);
  }

  const focusedTotal = sumValue(focused);

  return (
    <div className="cf-sunburst-frame">
      {drillable && showBreadcrumb && stack.length > 1 && (
        <nav className="cf-sunburst__breadcrumb" aria-label="drill path">
          {stack.map((node, i) => (
            <button
              key={i}
              type="button"
              className={'cf-sunburst__crumb' + (i === stack.length - 1 ? ' is-current' : '')}
              disabled={i === stack.length - 1}
              onClick={() => drillTo(i)}
            >
              {node.name}
            </button>
          ))}
        </nav>
      )}

      <svg
        className={['cf-chart cf-sunburst', drillable ? 'is-drillable' : '', className].filter(Boolean).join(' ')}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={ariaLabel}
      >
        {/*
          Key-based remount + keyframe runs every time the user drills in/out,
          giving a cheap zoom-fade pseudo-animation without per-segment d-attr
          interpolation. The center "↑" stays outside so it doesn't blink.
        */}
        <g key={stack.map((n) => n.name).join('/')} className="cf-sunburst__layer is-react-anim">
          {layout.segments.map((seg, i) => {
            const zoomable = drillable && !!seg.node.children?.length;
            return (
              <path
                key={i}
                className={
                  'cf-sunburst__segment' +
                  ` cf-chart__bar--${seg.colorIndex}` +
                  (zoomable ? ' is-zoomable' : '')
                }
                d={seg.path}
                tabIndex={zoomable ? 0 : undefined}
                onClick={() => onSegmentClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSegmentClick(i);
                  }
                }}
                onPointerEnter={(e) =>
                  onItemEnter?.({
                    node: seg.node,
                    depth: seg.depth,
                    pathNames: pathTo(root, seg.node),
                    totalValue: sumValue(seg.node),
                    nativeEvent: e.nativeEvent,
                  })
                }
                onPointerLeave={(e) =>
                  onItemLeave?.({
                    node: seg.node,
                    depth: seg.depth,
                    pathNames: pathTo(root, seg.node),
                    totalValue: sumValue(seg.node),
                    nativeEvent: e.nativeEvent,
                  })
                }
              >
                <title>{seg.node.name}</title>
              </path>
            );
          })}
          {showLabels &&
            layout.segments
              .filter((s) => s.endAngle - s.startAngle >= labelMinAngle)
              .map((seg, i) => {
                const p = labelXY(seg);
                return (
                  <text key={`l${i}`} className="cf-sunburst__label" x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central">
                    {seg.node.name}
                  </text>
                );
              })}
        </g>

        {drillable && canDrillUp && (
          <g
            className="cf-sunburst__center"
            transform={`translate(${size / 2}, ${size / 2})`}
            tabIndex={0}
            role="button"
            aria-label="返回上一层"
            onClick={drillUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                drillUp();
              }
            }}
          >
            <circle r={22} />
            <text className="cf-sunburst__center-label" textAnchor="middle" dominantBaseline="middle" dy="-2">↑</text>
            <text className="cf-sunburst__center-name" textAnchor="middle" dominantBaseline="middle" dy="14">{focused.name}</text>
          </g>
        )}
      </svg>

      {drillable && canDrillUp && (
        <footer className="cf-sunburst__footer">
          <span className="cf-sunburst__focus-label">当前焦点 · {focused.name}</span>
          <span className="cf-sunburst__focus-total">{focusedTotal.toLocaleString()}</span>
        </footer>
      )}
    </div>
  );
}
