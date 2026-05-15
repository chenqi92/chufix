import { useMemo, useRef, useState } from 'react';
import {
  type FlameFrame,
  type FlameNode,
  flattenFlame,
  maxDepth,
  nodeAtPath,
  colorFor,
} from './variants';

export interface FlamegraphProps {
  data: FlameNode;
  rowHeight?: number;
  minWidth?: number;
  unit?: string;
  className?: string;
  onFrameClick?: (node: FlameNode, path: number[]) => void;
  onFrameHover?: (node: FlameNode | null) => void;
}

function labelFits(widthPct: number, name: string, totalWidth: number): boolean {
  const px = widthPct * totalWidth;
  return px > Math.max(40, name.length * 6);
}

export function Flamegraph({
  data,
  rowHeight = 18,
  minWidth = 2,
  unit = 'ms',
  className,
  onFrameClick,
  onFrameHover,
}: FlamegraphProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [zoomPath, setZoomPath] = useState<number[]>([]);
  const [hovered, setHovered] = useState<FlameFrame | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const zoomedRoot = useMemo(() => nodeAtPath(data, zoomPath) ?? data, [data, zoomPath]);
  const frames = useMemo(() => flattenFlame(zoomedRoot, 0, 1), [zoomedRoot]);
  const depth = useMemo(() => maxDepth(zoomedRoot) + 1, [zoomedRoot]);
  const totalHeight = depth * rowHeight;

  function onClick(f: FlameFrame) {
    const next = [...zoomPath, ...f.path];
    setZoomPath(next);
    onFrameClick?.(f.node, next);
  }
  function onHover(f: FlameFrame, ev: React.MouseEvent) {
    setHovered(f);
    if (rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setCursor({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
    }
    onFrameHover?.(f.node);
  }
  function onLeave() {
    setHovered(null);
    onFrameHover?.(null);
  }

  return (
    <div
      ref={rootRef}
      className={['cf-flame', className].filter(Boolean).join(' ')}
    >
      {zoomPath.length > 0 && (
        <button
          type="button"
          className="cf-flame__reset"
          onClick={() => setZoomPath([])}
        >
          ← 重置缩放
        </button>
      )}
      <svg
        className="cf-flame__svg"
        viewBox={`0 0 1000 ${totalHeight}`}
        preserveAspectRatio="none"
        style={{ height: `${totalHeight}px` }}
        onMouseLeave={onLeave}
      >
        {frames.map((f, i) => (
          <g
            key={i}
            transform={`translate(${f.x * 1000}, ${f.depth * rowHeight})`}
            onClick={() => onClick(f)}
            onMouseMove={(ev) => onHover(f, ev)}
          >
            <rect
              width={Math.max(minWidth, f.width * 1000)}
              height={rowHeight - 1}
              fill={colorFor(f.node)}
              stroke={hovered === f ? 'var(--fg-1)' : 'transparent'}
              strokeWidth={1}
              rx={1}
              className="cf-flame__rect"
            />
            {labelFits(f.width, f.node.name, 1000) && (
              <text
                x={6}
                y={rowHeight - 6}
                fill="var(--bg-0)"
                fontSize={11}
                fontFamily="var(--font-mono)"
              >
                {f.node.name}
              </text>
            )}
          </g>
        ))}
      </svg>
      {hovered && (
        <div
          className="cf-flame__tooltip"
          style={{ left: `${cursor.x + 12}px`, top: `${cursor.y + 12}px` }}
        >
          <strong>{hovered.node.name}</strong>
          <span>
            {hovered.node.value} {unit} · {(hovered.width * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
