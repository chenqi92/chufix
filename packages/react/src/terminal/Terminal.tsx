import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { type TerminalLine, normalizeLine } from './variants';

export interface TerminalProps {
  lines: (TerminalLine | string)[];
  prompt?: string;
  title?: string;
  height?: number | string;
  follow?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function Terminal({
  lines,
  prompt = '$',
  title,
  height,
  follow = true,
  showHeader = true,
  className,
}: TerminalProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const normalized = useMemo(() => lines.map(normalizeLine), [lines]);

  function scrollToBottom() {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    if (follow) scrollToBottom();
  }, [normalized.length, follow]);

  const style: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={['cf-term', className].filter(Boolean).join(' ')} style={style}>
      {showHeader && (
        <div className="cf-term__header">
          <span className="cf-term__dot cf-term__dot--red" />
          <span className="cf-term__dot cf-term__dot--yellow" />
          <span className="cf-term__dot cf-term__dot--green" />
          {title && <span className="cf-term__title">{title}</span>}
        </div>
      )}
      <div ref={scrollerRef} className="cf-term__body">
        {normalized.map((line, i) => (
          <div
            key={i}
            className={['cf-term__line', line.type && `cf-term__line--${line.type}`]
              .filter(Boolean)
              .join(' ')}
          >
            {line.type === 'command' && <span className="cf-term__prompt">{prompt}</span>}
            <span className="cf-term__text">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
