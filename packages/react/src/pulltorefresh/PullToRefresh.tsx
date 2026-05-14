import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useDrag } from '../hooks/useDrag';
import type { PullStage, PullToRefreshProps } from './variants';

export function PullToRefresh(props: PullToRefreshProps) {
  const {
    threshold = 64,
    maxDistance = 96,
    refreshing,
    disabled = false,
    onRefresh,
    pullingLabel = '下拉刷新',
    readyLabel = '释放刷新',
    refreshingLabel = '加载中...',
    children,
  } = props;

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const isRefreshing = refreshing ?? internalRefreshing;

  useEffect(() => {
    if (refreshing === false) setOffset(0);
  }, [refreshing]);

  const stage: PullStage = isRefreshing
    ? 'refreshing'
    : offset <= 0
      ? 'idle'
      : offset >= threshold
        ? 'ready'
        : 'pulling';

  useDrag(scrollerRef, {
    axis: 'y',
    onMove(s) {
      if (disabled || isRefreshing) return;
      if (s.dy <= 0) {
        setOffset(0);
        return;
      }
      if (scrollerRef.current && scrollerRef.current.scrollTop > 0) {
        setOffset(0);
        return;
      }
      const eased = maxDistance * (1 - Math.exp(-s.dy / maxDistance));
      setOffset(eased);
    },
    onEnd() {
      if (disabled || isRefreshing) return;
      if (offset >= threshold) {
        setInternalRefreshing(true);
        setOffset(threshold);
        const result = onRefresh?.();
        Promise.resolve(result).finally(() => {
          if (refreshing !== undefined) return; // controlled
          setInternalRefreshing(false);
          setOffset(0);
        });
      } else {
        setOffset(0);
      }
    },
  });

  const rotationDeg = useMemo(() => {
    if (isRefreshing) return 0;
    const ratio = Math.min(1, offset / threshold);
    return Math.round(180 * ratio);
  }, [isRefreshing, offset, threshold]);

  const indicatorStyle: CSSProperties = {
    height: `${offset || (isRefreshing ? threshold : 0)}px`,
    transition: stage === 'pulling' ? 'none' : 'height var(--dur-fast) var(--ease-out)',
  };

  return (
    <div ref={scrollerRef} className="cf-ptr" data-stage={stage}>
      <div className="cf-ptr__indicator" style={indicatorStyle}>
        <span className={['cf-ptr__spinner', isRefreshing ? 'is-spinning' : ''].filter(Boolean).join(' ')}>
          {!isRefreshing ? (
            <svg
              viewBox="0 0 16 16"
              width={16}
              height={16}
              aria-hidden
              style={{ transform: `rotate(${rotationDeg}deg)`, transition: 'transform 80ms linear' }}
            >
              <path
                d="M8 2v10M4 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden className="cf-ptr__spinner-arc">
              <circle
                cx={8}
                cy={8}
                r={6}
                stroke="currentColor"
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="20 12"
              />
            </svg>
          )}
        </span>
        <span className="cf-ptr__label">
          {stage === 'pulling' && pullingLabel}
          {stage === 'ready' && readyLabel}
          {stage === 'refreshing' && refreshingLabel}
        </span>
      </div>
      <div className="cf-ptr__content">{children}</div>
    </div>
  );
}
