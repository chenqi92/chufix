import { useRef, useState } from 'react';
import type { CitationMarkProps } from './variants';

export function CitationMark(props: CitationMarkProps) {
  const { index, source, disableHover = false } = props;
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (disableHover) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  }
  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }
  function onClick() {
    if (source.url && typeof window !== 'undefined') {
      window.open(source.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <sup
      className={['cf-citation', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <button
        type="button"
        className="cf-citation__mark"
        aria-label={`引用 ${index}：${source.title}`}
        onClick={onClick}
      >
        {index}
      </button>
      {open && !disableHover && (
        <span className="cf-citation__card" role="tooltip">
          <span className="cf-citation__card-head">
            {source.favicon && <img src={source.favicon} alt="" className="cf-citation__favicon" />}
            <span className="cf-citation__title">{source.title}</span>
          </span>
          {source.domain && <span className="cf-citation__domain">{source.domain}</span>}
          {source.snippet && <span className="cf-citation__snippet">{source.snippet}</span>}
          {source.url && (
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="cf-citation__link">
              打开来源 →
            </a>
          )}
        </span>
      )}
    </sup>
  );
}
