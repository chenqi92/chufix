import { useEffect, useMemo, useState } from 'react';
import {
  layoutTreemap,
  treemapValue,
  type TreemapNode,
  type TreemapProps,
} from './variants';

export function Treemap(props: TreemapProps) {
  const {
    nodes,
    width = 480,
    height = 240,
    showLabels = true,
    ariaLabel = '矩形树图',
    childPadding = 4,
    headerHeight = 16,
    drillable = true,
    showBreadcrumb = true,
    layout = 'squarify',
    className,
    onItemEnter,
    onItemLeave,
    onDrill,
  } = props;

  const [stack, setStack] = useState<TreemapNode[]>([]);
  useEffect(() => {
    setStack([]);
  }, [nodes]);

  const focusedChildren = useMemo<TreemapNode[]>(() => {
    if (!stack.length) return nodes ?? [];
    return stack[stack.length - 1].children ?? [];
  }, [stack, nodes]);

  const rects = useMemo(
    () => layoutTreemap(focusedChildren, width, height, { childPadding, headerHeight, layout }),
    [focusedChildren, width, height, childPadding, headerHeight, layout],
  );

  const canDrillUp = stack.length > 0;
  const focusedTotal = focusedChildren.reduce((s, n) => s + treemapValue(n), 0);
  const focusedName = stack.length ? stack[stack.length - 1].name : '全部';

  function pathFromRoot(node: TreemapNode): string[] {
    return [...stack.map((n) => n.name), node.name];
  }

  function onRectClick(idx: number) {
    if (!drillable) return;
    const r = rects[idx];
    if (!r || r.depth !== 0 || !r.hasChildren) return;
    setStack((prev) => [...prev, r.node]);
    onDrill?.({ node: r.node, pathNames: pathFromRoot(r.node) });
  }

  function drillTo(index: number) {
    if (!drillable) return;
    if (index === stack.length - 1) return;
    const next = index < 0 ? [] : stack.slice(0, index + 1);
    setStack(next);
    const node = next.length ? next[next.length - 1] : null;
    onDrill?.({ node, pathNames: node ? pathFromRoot(node) : [] });
  }

  function drillUp() {
    if (!drillable || !stack.length) return;
    drillTo(stack.length - 2);
  }

  return (
    <div className="cf-treemap-frame">
      {drillable && showBreadcrumb && canDrillUp && (
        <nav className="cf-treemap__breadcrumb" aria-label="drill path">
          <button type="button" className="cf-treemap__crumb" onClick={() => drillTo(-1)}>
            全部
          </button>
          {stack.map((node, i) => (
            <button
              key={i}
              type="button"
              className={'cf-treemap__crumb' + (i === stack.length - 1 ? ' is-current' : '')}
              disabled={i === stack.length - 1}
              onClick={() => drillTo(i)}
            >
              {node.name}
            </button>
          ))}
          <button type="button" className="cf-treemap__up" disabled={!canDrillUp} onClick={drillUp}>
            ↑ 上一层
          </button>
        </nav>
      )}

      <svg
        className={['cf-chart cf-treemap', drillable ? 'is-drillable' : '', className].filter(Boolean).join(' ')}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
      >
        {rects.map((r, i) => (
          <g
            key={i}
            className={
              'cf-treemap__cell' +
              (r.hasChildren ? ' has-children' : '') +
              (r.depth === 0 ? ' is-top' : ' is-nested')
            }
            onPointerEnter={(e) =>
              onItemEnter?.({
                node: r.node,
                dataIndex: r.dataIndex,
                depth: r.depth,
                pathNames: [...stack.map((n) => n.name), ...r.path],
                nativeEvent: e.nativeEvent,
              })
            }
            onPointerLeave={(e) =>
              onItemLeave?.({
                node: r.node,
                dataIndex: r.dataIndex,
                depth: r.depth,
                pathNames: [...stack.map((n) => n.name), ...r.path],
                nativeEvent: e.nativeEvent,
              })
            }
            onClick={() => onRectClick(i)}
          >
            <rect
              className={`cf-chart__bar--${r.colorIndex}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              stroke="var(--bg-1)"
              strokeWidth={1}
              opacity={r.depth === 0 ? (r.hasChildren ? 0.35 : 0.9) : 0.85}
            />
            {showLabels && r.w > 50 && r.h > 14 ? (
              <text
                x={r.x + 6}
                y={r.y + (r.depth === 0 && r.hasChildren ? 12 : 14)}
                fontWeight={r.depth === 0 ? 600 : 500}
                fill="var(--fg-on-viz, var(--fg-1))"
              >
                {r.node.name}
              </text>
            ) : null}
            {showLabels && r.w > 80 && r.h > 30 && !r.hasChildren ? (
              <text
                x={r.x + 6}
                y={r.y + 28}
                fill="var(--fg-on-viz, var(--fg-2))"
                opacity={0.85}
                fontSize={11}
              >
                {treemapValue(r.node).toLocaleString()}
              </text>
            ) : null}
          </g>
        ))}
      </svg>

      {canDrillUp && (
        <footer className="cf-treemap__footer">
          <span className="cf-treemap__focus-label">当前焦点 · {focusedName}</span>
          <span className="cf-treemap__focus-total">{focusedTotal.toLocaleString()}</span>
        </footer>
      )}
    </div>
  );
}
