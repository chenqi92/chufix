import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { computeGrid, type VirtualGridProps } from './variants';

export function VirtualGrid<T>(props: VirtualGridProps<T>) {
  const {
    items,
    itemHeight,
    minColumnWidth = 200,
    columns,
    gap = 8,
    overscan = 2,
    height,
    className,
    itemKey,
    renderItem,
  } = props;

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const [viewportHeight, setViewportHeight] = useState(400);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    setViewportHeight(el.clientHeight);
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        setContainerWidth(el.clientWidth);
        setViewportHeight(el.clientHeight);
      });
      ro.observe(el);
    }
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro?.disconnect();
    };
  }, []);

  const win = useMemo(
    () =>
      computeGrid({
        totalItems: items.length,
        containerWidth,
        itemHeight,
        scrollTop,
        viewportHeight,
        gap,
        overscan,
        columns,
        minColumnWidth,
      }),
    [items.length, containerWidth, itemHeight, scrollTop, viewportHeight, gap, overscan, columns, minColumnWidth],
  );

  const cells: { item: T; index: number; row: number; col: number; key: string | number }[] = [];
  for (let r = win.rowStart; r < win.rowEnd; r++) {
    for (let c = 0; c < win.cols; c++) {
      const idx = r * win.cols + c;
      if (idx >= items.length) break;
      const item = items[idx];
      cells.push({ item, index: idx, row: r, col: c, key: itemKey ? itemKey(item, idx) : idx });
    }
  }

  const rootStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : (height ?? '100%'),
  };
  const innerStyle: CSSProperties = {
    height: `${win.totalRows * win.rowHeight - gap}px`,
    position: 'relative',
  };

  return (
    <div ref={scrollerRef} className={['cf-vgrid', className].filter(Boolean).join(' ')} style={rootStyle}>
      <div className="cf-vgrid__inner" style={innerStyle}>
        {cells.map((cell) => (
          <div
            key={cell.key}
            className="cf-vgrid__cell"
            style={{
              position: 'absolute',
              top: `${cell.row * win.rowHeight}px`,
              left: `${cell.col * (win.cellWidth + gap)}px`,
              width: `${win.cellWidth}px`,
              height: `${itemHeight}px`,
            }}
          >
            {renderItem(cell.item, cell.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
