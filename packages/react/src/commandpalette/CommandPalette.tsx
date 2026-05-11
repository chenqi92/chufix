import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  filterAndGroup,
  flatten,
  highlight,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from './variants';

export function CommandPalette(props: CommandPaletteProps) {
  const {
    open,
    onOpenChange,
    items,
    placeholder = '搜索命令、请求、设置…',
    emptyText = '无匹配结果',
    closeOnSelect = true,
    hideFooter = false,
    container,
    onSelect,
  } = props;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const groups = useMemo(() => filterAndGroup(items, query), [items, query]);
  const flat = useMemo(() => flatten(groups), [groups]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelectorAll<HTMLElement>(
      '.cf-cmdpal__row',
    )[activeIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const close = () => onOpenChange(false);

  const pick = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    onSelect?.(item.id, item);
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = flat[activeIndex];
      if (it) pick(it);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);
  if (!open || !target) return null;

  return createPortal(
    <div
      className="cf-cmdpal__overlay"
      onClick={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div className="cf-cmdpal" role="dialog" aria-modal="true">
        <div className="cf-cmdpal__input">
          <svg
            className="cf-cmdpal__search-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx={7}
              cy={7}
              r={4.5}
              stroke="currentColor"
              strokeWidth={1.4}
              fill="none"
            />
            <path
              d="M11 11l3 3"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
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
        </div>
        <div ref={listRef} className="cf-cmdpal__list">
          {!flat.length ? (
            <div className="cf-cmdpal__empty">{emptyText}</div>
          ) : (
            groups.map((grp, gi) => (
              <Fragment key={grp.group || gi}>
                {grp.group ? (
                  <div className="cf-cmdpal__section">{grp.group}</div>
                ) : null}
                {grp.items.map((item) => {
                  const flatIdx = flat.findIndex((f) => f.id === item.id);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.disabled}
                      aria-selected={isActive}
                      className={[
                        'cf-cmdpal__row',
                        isActive && 'is-active',
                        item.disabled && 'is-disabled',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => pick(item)}
                    >
                      <span className="cf-cmdpal__name">
                        {highlight(item.label, query).map((p, pi) =>
                          p.match ? (
                            <strong key={pi} className="cf-cmdpal__hl">
                              {p.text}
                            </strong>
                          ) : (
                            <Fragment key={pi}>{p.text}</Fragment>
                          ),
                        )}
                      </span>
                      {item.description ? (
                        <span className="cf-cmdpal__desc">
                          {item.description}
                        </span>
                      ) : null}
                      {item.shortcut ? (
                        <span className="cf-cmdpal__shortcut">
                          {item.shortcut}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </Fragment>
            ))
          )}
        </div>
        {!hideFooter ? (
          <div className="cf-cmdpal__footer">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> 导航
            </span>
            <span>
              <kbd>↵</kbd> 选择
            </span>
            <span className="cf-cmdpal__spacer" />
            <span>
              <kbd>Esc</kbd> 关闭
            </span>
          </div>
        ) : null}
      </div>
    </div>,
    target,
  );
}
