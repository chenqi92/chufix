import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as RMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  filterResults,
  type GlobalSearchProps,
  type GlobalSearchResult,
} from './variants';

export function GlobalSearch(props: GlobalSearchProps) {
  const {
    open,
    onOpenChange,
    results,
    placeholder = '搜索任何内容…',
    emptyText = '无匹配结果',
    showCategories = true,
    closeOnSelect = true,
    container,
    onSelect,
    className,
  } = props;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const r of results) set.add(r.category);
    return Array.from(set);
  }, [results]);

  const groups = useMemo(
    () => filterResults(results, query, activeCategory),
    [results, query, activeCategory],
  );

  const flat = useMemo(() => groups.flatMap((g) => g.results), [groups]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveCategory(null);
    setActiveIndex(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, activeCategory]);

  const close = () => onOpenChange(false);

  const pick = (r: GlobalSearchResult) => {
    if (r.disabled) return;
    onSelect?.(r.id, r);
    if (closeOnSelect) close();
  };

  const move = (delta: number) => {
    if (!flat.length) return;
    const n = flat.length;
    setActiveIndex((cur) => {
      let i = cur;
      for (let s = 0; s < n; s++) {
        i = (i + delta + n) % n;
        if (!flat[i].disabled) break;
      }
      return i;
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[activeIndex];
      if (r) pick(r);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  const onOverlayClick = (e: RMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);
  if (!open || !target) return null;

  return createPortal(
    <div
      className={['cf-globalsearch__overlay', className]
        .filter(Boolean)
        .join(' ')}
      onClick={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div className="cf-globalsearch" role="dialog" aria-modal="true">
        <div className="cf-globalsearch__input">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx={7} cy={7} r={4.5} stroke="currentColor" strokeWidth={1.4} />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="cf-globalsearch__hint">Esc</kbd>
        </div>

        {showCategories && allCategories.length > 1 ? (
          <div className="cf-globalsearch__cats" role="tablist">
            <button
              type="button"
              className="cf-globalsearch__cat"
              aria-pressed={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            >
              全部
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="cf-globalsearch__cat"
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : null}

        <div className="cf-globalsearch__list">
          {!flat.length ? (
            <div className="cf-globalsearch__empty">{emptyText}</div>
          ) : (
            groups.map((grp) => (
              <Fragment key={grp.category}>
                <div className="cf-globalsearch__group-head">{grp.category}</div>
                {grp.results.map((r) => {
                  const flatIdx = flat.findIndex((f) => f.id === r.id);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={r.disabled}
                      className={[
                        'cf-globalsearch__row',
                        isActive && 'is-active',
                        r.disabled && 'is-disabled',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => pick(r)}
                    >
                      <div className="cf-globalsearch__col">
                        <div className="cf-globalsearch__title">
                          <span>{r.title}</span>
                          {r.badge ? (
                            <span className="cf-globalsearch__badge">{r.badge}</span>
                          ) : null}
                        </div>
                        {r.description || r.path ? (
                          <div className="cf-globalsearch__sub">
                            {r.path ? (
                              <span className="cf-globalsearch__path">{r.path}</span>
                            ) : null}
                            {r.description ? <span>{r.description}</span> : null}
                          </div>
                        ) : null}
                      </div>
                      {r.shortcut ? (
                        <span className="cf-globalsearch__shortcut">
                          {r.shortcut}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </Fragment>
            ))
          )}
        </div>
      </div>
    </div>,
    target,
  );
}
