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
    <div ref={rootRef} className={['cf-flame', className].filter(Boolean).join(' ')}>
      {zoomPath.length > 0 && (
        <button
          type="button"
          className="cf-flame__reset"
          onClick={() => setZoomPath([])}
        >
          ← 重置缩放
        </button>
      )}
      <div
        className="cf-flame__viewport"
        style={{ height: `${totalHeight}px` }}
        onMouseLeave={onLeave}
      >
        {frames.map((f, i) => (
          <button
            key={i}
            type="button"
            className={['cf-flame__rect', hovered === f && 'is-hovered'].filter(Boolean).join(' ')}
            style={{
              left: `${f.x * 100}%`,
              width: `max(${minWidth}px, ${f.width * 100}%)`,
              top: `${f.depth * rowHeight}px`,
              height: `${rowHeight - 1}px`,
              background: colorFor(f.node),
            }}
            onClick={() => onClick(f)}
            onMouseMove={(ev) => onHover(f, ev)}
          >
            <span className="cf-flame__label">{f.node.name}</span>
          </button>
        ))}
      </div>
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
