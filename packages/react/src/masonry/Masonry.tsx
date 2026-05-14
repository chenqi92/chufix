import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { computeColumns, type MasonryProps } from './variants';

export function Masonry(props: MasonryProps) {
  const { columns, minColumnWidth = 240, gap = 12, children } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useResizeObserver(rootRef, (entries) => {
    setWidth(entries[0]?.contentRect.width ?? 0);
  });

  const cols = useMemo(
    () => computeColumns(width || 800, { columns, minColumnWidth }),
    [width, columns, minColumnWidth],
  );

  const style: CSSProperties & Record<string, string | number> = {
    columnCount: cols,
    columnGap: `${gap}px`,
    ['--cf-masonry-gap' as string]: `${gap}px`,
  };

  return (
    <div ref={rootRef} className="cf-masonry" style={style}>
      {children}
    </div>
  );
}
