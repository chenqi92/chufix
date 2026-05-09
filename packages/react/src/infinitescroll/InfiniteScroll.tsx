import { useEffect, useRef } from 'react';
import { infiniteScrollClass, type InfiniteScrollProps } from './variants';

export function InfiniteScroll({
  children,
  loading = false,
  finished = false,
  threshold = 100,
  className,
  loadingNode,
  finishedNode,
  onLoad,
}: InfiniteScrollProps) {
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sentinel.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !loading && !finished) onLoad?.();
        }
      },
      { rootMargin: `${threshold}px` },
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [loading, finished, threshold, onLoad]);

  const cls = infiniteScrollClass({ className });
  return (
    <div className={cls}>
      {children}
      <div ref={sentinel} className="cf-infscroll__sentinel" aria-hidden="true">
        {loading && (
          <div className="cf-infscroll__hint">{loadingNode ?? '加载中…'}</div>
        )}
        {!loading && finished && (
          <div className="cf-infscroll__hint">{finishedNode ?? '没有更多了'}</div>
        )}
      </div>
    </div>
  );
}
