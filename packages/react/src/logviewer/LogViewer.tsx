import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  type LogEntry,
  type LogLevel,
  formatTimestamp,
  highlight,
} from './variants';

export interface LogViewerProps {
  logs: LogEntry[];
  follow?: boolean;
  search?: string;
  height?: number | string;
  showTimestamp?: boolean;
  showLevel?: boolean;
  showSource?: boolean;
  levels?: LogLevel[];
  className?: string;
  onFollowChange?: (following: boolean) => void;
}

export function LogViewer({
  logs,
  follow = true,
  search,
  height = 320,
  showTimestamp = true,
  showLevel = true,
  showSource,
  levels,
  className,
  onFollowChange,
}: LogViewerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  const filtered = useMemo(() => {
    if (!levels || levels.length === 0) return logs;
    return logs.filter((l) => (l.level ? levels.includes(l.level) : true));
  }, [logs, levels]);

  function isNearBottom(): boolean {
    const el = scrollerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 8;
  }

  function onScroll() {
    const next = isNearBottom();
    setAtBottom((prev) => {
      if (prev !== next) onFollowChange?.(next);
      return next;
    });
  }

  function scrollToBottom() {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    if (follow && atBottom) scrollToBottom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, follow, atBottom]);

  useEffect(scrollToBottom, []);

  const style: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={['cf-logv', className].filter(Boolean).join(' ')} style={style}>
      <div ref={scrollerRef} className="cf-logv__scroller" onScroll={onScroll}>
        {filtered.map((log, i) => (
          <div
            key={log.id ?? i}
            className={['cf-logv__row', log.level && `cf-logv__row--${log.level}`]
              .filter(Boolean)
              .join(' ')}
          >
            {showTimestamp && (
              <span className="cf-logv__ts">{formatTimestamp(log.timestamp)}</span>
            )}
            {showLevel && log.level && (
              <span className="cf-logv__level">{log.level.toUpperCase()}</span>
            )}
            {showSource && log.source && <span className="cf-logv__source">{log.source}</span>}
            <span className="cf-logv__msg">
              {highlight(log.message, search ?? '').map((seg, j) =>
                seg.match ? (
                  <mark key={j} className="cf-logv__match">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={j}>{seg.text}</span>
                ),
              )}
            </span>
          </div>
        ))}
      </div>
      {!atBottom && (
        <button type="button" className="cf-logv__follow" onClick={scrollToBottom}>
          ↓ 跳到底部
        </button>
      )}
    </div>
  );
}
