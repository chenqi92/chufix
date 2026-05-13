import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { annularPath, buildLayout, pathTo, sumValue } from './layout';
import type {
  SunburstChartProps,
  SunburstNode,
  SunburstSegment,
} from './variants';

function resolveStack(root: SunburstNode, path: string[] | undefined): SunburstNode[] {
  const out: SunburstNode[] = [root];
  if (!path?.length) return out;
  let cursor = root;
  for (let i = 1; i < path.length; i++) {
    const next = cursor.children?.find((c) => c.name === path[i]);
    if (!next) break;
    out.push(next);
    cursor = next;
  }
  return out;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

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
    focusPath,
    tween = 'fade',
    tweenDuration = 320,
    className,
    onItemEnter,
    onItemLeave,
    onDrill,
    onFocusPathChange,
  } = props;

  const [internalStack, setInternalStack] = useState<SunburstNode[]>(() =>
    resolveStack(root, focusPath),
  );

  useEffect(() => {
    setInternalStack(focusPath != null ? resolveStack(root, focusPath) : [root]);
  }, [root]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (focusPath == null) return;
    setInternalStack(resolveStack(root, focusPath));
  }, [focusPath, root]);

  const stack = useMemo<SunburstNode[]>(() => {
    if (focusPath != null) return resolveStack(root, focusPath);
    return internalStack;
  }, [focusPath, root, internalStack]);

  const commitStack = useCallback(
    (next: SunburstNode[]) => {
      const path = next.map((n) => n.name);
      if (focusPath != null) {
        onFocusPathChange?.(path);
        return;
      }
      setInternalStack(next);
      onFocusPathChange?.(path);
    },
    [focusPath, onFocusPathChange],
  );

  const focused = stack[stack.length - 1];
  const canDrillUp = stack.length > 1;

  const layout = useMemo(
    () => buildLayout(focused, { size, innerRadiusRatio }),
    [focused, size, innerRadiusRatio],
  );

  /* ─── morph tween (rAF-driven, mirrors Vue) ───
   * For each new segment we look up the prior segment with the same node
   * reference and lerp startAngle / endAngle / inner-outer radius. Brand-new
   * segments grow from a "collapsed" start matching the new outer ring. */
  const [displaySegments, setDisplaySegments] = useState<SunburstSegment[]>(layout.segments);
  const prevForTweenRef = useRef<SunburstSegment[]>(layout.segments);
  const animFrameRef = useRef<number | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const cancelAnim = useCallback(() => {
    if (animFrameRef.current != null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const rebuildPath = useCallback(
    (seg: SunburstSegment): SunburstSegment => {
      const cx = size / 2;
      const cy = size / 2;
      return {
        ...seg,
        path: annularPath(cx, cy, seg.innerR, seg.outerR, seg.startAngle, seg.endAngle),
        midAngle: (seg.startAngle + seg.endAngle) / 2,
        midRadius: (seg.innerR + seg.outerR) / 2,
      };
    },
    [size],
  );

  useEffect(() => {
    if (tween !== 'morph') {
      cancelAnim();
      setDisplaySegments(layout.segments);
      prevForTweenRef.current = layout.segments;
      return;
    }
    cancelAnim();
    /* Reduced motion: snap immediately. */
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplaySegments(layout.segments);
      prevForTweenRef.current = layout.segments;
      return;
    }
    const toSegs = layout.segments;
    const fromMap = new Map<SunburstNode, SunburstSegment>();
    for (const s of prevForTweenRef.current) fromMap.set(s.node, s);
    const startTime = performance.now();
    const duration = Math.max(0, tweenDuration);

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const k = duration > 0 ? Math.min(1, elapsed / duration) : 1;
      const ease = easeOutCubic(k);
      const next = toSegs.map((toSeg) => {
        const fromSeg = fromMap.get(toSeg.node);
        const f = fromSeg ?? {
          ...toSeg,
          startAngle: toSeg.startAngle,
          endAngle: toSeg.startAngle,
          innerR: toSeg.innerR,
          outerR: toSeg.innerR,
        };
        return rebuildPath({
          ...toSeg,
          startAngle: lerp(f.startAngle, toSeg.startAngle, ease),
          endAngle: lerp(f.endAngle, toSeg.endAngle, ease),
          innerR: lerp(f.innerR, toSeg.innerR, ease),
          outerR: lerp(f.outerR, toSeg.outerR, ease),
        });
      });
      setDisplaySegments(next);
      if (k < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        animFrameRef.current = null;
        prevForTweenRef.current = toSegs;
      }
    };
    animFrameRef.current = requestAnimationFrame(frame);
    return () => cancelAnim();
  }, [layout, tween, tweenDuration, rebuildPath, cancelAnim]);

  useEffect(() => () => cancelAnim(), [cancelAnim]);

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
    commitStack([...stack, seg.node]);
    onDrill?.({ node: seg.node, pathNames: pathTo(root, seg.node) });
  }
  function drillTo(index: number) {
    if (!drillable) return;
    if (index === stack.length - 1) return;
    const next = stack.slice(0, index + 1);
    commitStack(next);
    const node = next[next.length - 1];
    onDrill?.({ node, pathNames: pathTo(root, node) });
  }
  function drillUp() {
    if (!drillable || stack.length <= 1) return;
    drillTo(stack.length - 2);
  }

  const focusedTotal = sumValue(focused);

  const segments = displaySegments;
  const layerKey = stack.map((n) => n.name).join('/');

  /* Two branches share the same segment rendering so we factor it out. */
  const renderSegments = () => (
    <>
      {segments.map((seg, i) => {
        const zoomable = drillable && !!seg.node.children?.length;
        return (
          <path
            key={tween === 'morph' ? `${seg.node.name}|${seg.depth}` : i}
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
        segments
          .filter((s) => s.endAngle - s.startAngle >= labelMinAngle)
          .map((seg, i) => {
            const p = labelXY(seg);
            return (
              <text key={`l${i}`} className="cf-sunburst__label" x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central">
                {seg.node.name}
              </text>
            );
          })}
    </>
  );

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
          Two render paths:
          - tween='fade' (default): the layer is remounted via React keying so
            the keyframe animation in CSS re-runs.
          - tween='morph': segments stay mounted; rAF interpolates the path d.
          Both source from `displaySegments`, which the effect keeps in sync.
        */}
        {tween === 'fade' ? (
          <g key={layerKey} className="cf-sunburst__layer is-react-anim">
            {renderSegments()}
          </g>
        ) : (
          <g className="cf-sunburst__layer is-morph">{renderSegments()}</g>
        )}

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
