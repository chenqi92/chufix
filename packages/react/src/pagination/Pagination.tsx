import { useState, useRef, useEffect } from 'react';
import {
  type PaginationProps,
  buildPages,
  paginationClass,
} from './variants';

export function Pagination(props: PaginationProps) {
  const {
    value,
    defaultValue = 1,
    total = 0,
    pageSize = 10,
    siblingCount = 1,
    size = 'md',
    showNav = true,
    showJumper = false,
    showTotal = false,
    onChange,
  } = props;

  const controlled = value != null;
  const [inner, setInner] = useState<number>(defaultValue);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(1, Math.min(controlled ? (value as number) : inner, totalPages));

  const [jumperText, setJumperText] = useState('');
  const lastCurrent = useRef(current);
  useEffect(() => {
    if (lastCurrent.current !== current) {
      setJumperText('');
      lastCurrent.current = current;
    }
  }, [current]);

  function go(p: number) {
    if (p < 1 || p > totalPages || p === current) return;
    if (!controlled) setInner(p);
    onChange?.(p);
  }
  function commitJumper() {
    const n = parseInt(jumperText, 10);
    if (Number.isNaN(n)) return setJumperText('');
    go(n);
  }

  const items = buildPages(current, totalPages, siblingCount);

  return (
    <nav className={paginationClass({ size })} role="navigation" aria-label="pagination">
      {showTotal && <span className="cf-pagination__total">共 {total} 条</span>}

      {showNav && (
        <button
          type="button"
          className="cf-pagination__nav"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
          aria-label="上一页"
        >‹</button>
      )}

      {items.map((p, idx) => (
        <button
          key={idx}
          type="button"
          className={[
            'cf-pagination__page',
            p === current ? 'is-active' : '',
            p === '…' ? 'is-ellipsis' : '',
          ].filter(Boolean).join(' ')}
          disabled={p === '…'}
          aria-current={p === current ? 'page' : undefined}
          onClick={() => typeof p === 'number' && go(p)}
        >{p}</button>
      ))}

      {showNav && (
        <button
          type="button"
          className="cf-pagination__nav"
          disabled={current >= totalPages}
          onClick={() => go(current + 1)}
          aria-label="下一页"
        >›</button>
      )}

      {showJumper && (
        <span className="cf-pagination__jumper">
          跳至
          <input
            type="text"
            inputMode="numeric"
            value={jumperText}
            onChange={(e) => setJumperText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitJumper()}
            onBlur={commitJumper}
            className="cf-pagination__input"
          />
          页
        </span>
      )}
    </nav>
  );
}
