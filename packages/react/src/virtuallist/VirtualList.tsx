import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { computeWindow, type VirtualListProps } from './variants';

export interface VirtualListHandle {
  scrollTo(offset: number): void;
}

function VirtualListInner<T>(
  props: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>,
) {
  const {
    items,
    itemHeight,
    overscan = 5,
    height,
    scrollToIndex,
    className,
    itemKey,
    renderItem,
  } = props;

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(400);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
      ro.observe(el);
    }
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollToIndex == null || !scrollerRef.current) return;
    const el = scrollerRef.current;
    if (typeof itemHeight === 'number') {
      el.scrollTo({ top: scrollToIndex * itemHeight });
    } else {
      let off = 0;
      for (let i = 0; i < scrollToIndex; i++) off += itemHeight(items[i], i);
      el.scrollTo({ top: off });
    }
  }, [scrollToIndex, itemHeight, items]);

  useImperativeHandle(ref, () => ({
    scrollTo(offset: number) {
      scrollerRef.current?.scrollTo({ top: offset });
    },
  }), []);

  const win = useMemo(
    () => computeWindow({ items, itemHeight, overscan, scrollTop, viewportHeight }),
    [items, itemHeight, overscan, scrollTop, viewportHeight],
  );

  const visible: { item: T; index: number; key: string | number }[] = [];
  for (let i = win.start; i < win.end; i++) {
    const item = items[i];
    visible.push({ item, index: i, key: itemKey ? itemKey(item, i) : i });
  }

  const rootStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : (height ?? '100%'),
  };
  const innerStyle: CSSProperties = { height: `${win.totalHeight}px` };
  const padStyle: CSSProperties = { transform: `translateY(${win.offsetTop}px)` };

  return (
    <div ref={scrollerRef} className={['cf-vlist', className].filter(Boolean).join(' ')} style={rootStyle}>
      <div className="cf-vlist__inner" style={innerStyle}>
        <div className="cf-vlist__pad" style={padStyle}>
          {visible.map((entry) => (
            <div key={entry.key} className="cf-vlist__row">
              {renderItem(entry.item, entry.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> },
) => React.ReactElement;
