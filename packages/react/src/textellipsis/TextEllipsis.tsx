import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { textEllipsisClass, type TextEllipsisProps } from './variants';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function TextEllipsis({
  text,
  children,
  rows = 2,
  expandable = false,
  expandText = '展开',
  collapseText = '收起',
  className,
}: TextEllipsisProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const inner = useRef<HTMLSpanElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, rows, children]);

  const cls = textEllipsisClass({ expanded, className });
  const innerStyle = {
    WebkitLineClamp: expanded ? 'unset' : String(rows),
  } as React.CSSProperties;

  return (
    <span className={cls}>
      <span ref={inner} className="cf-textellipsis__text" style={innerStyle}>
        {children ?? text}
      </span>
      {expandable && (overflowing || expanded) && (
        <button
          type="button"
          className="cf-textellipsis__toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? collapseText : expandText}
        </button>
      )}
    </span>
  );
}
