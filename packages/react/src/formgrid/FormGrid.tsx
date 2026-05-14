import { useRef, useState, type CSSProperties } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { resolveColumns, type FormGridProps } from './variants';

export function FormGrid(props: FormGridProps) {
  const { columns = { sm: 1, md: 2 }, gap = 16, children } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(typeof window === 'undefined' ? 1024 : window.innerWidth);

  useResizeObserver(rootRef, (entries) => {
    setWidth(entries[0]?.contentRect.width ?? width);
  });

  const cols = resolveColumns(columns, width);
  const style: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${gap}px`,
  };

  return (
    <div ref={rootRef} className="cf-formgrid" style={style}>
      {children}
    </div>
  );
}
