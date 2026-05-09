import { useEffect, useState, type MouseEvent } from 'react';
import { tocClass, type TocProps } from './variants';

export function Toc(props: TocProps) {
  const {
    items,
    autoSpy = false,
    scrollRoot,
    activeId,
    defaultActiveId = null,
    title,
    maxDepth = 6,
    className,
    onActiveIdChange,
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActive, setInternalActive] = useState<string | null>(defaultActiveId);
  const current = isControlled ? activeId : internalActive;

  function commit(id: string | null) {
    if (!isControlled) setInternalActive(id);
    onActiveIdChange?.(id);
  }

  useEffect(() => {
    if (!autoSpy || typeof window === 'undefined') return;
    const root = scrollRoot ? document.querySelector(scrollRoot) : null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) commit(visible.target.id);
      },
      {
        root: (root as Element | null) ?? null,
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 1],
      },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, autoSpy, scrollRoot]);

  function scrollTo(id: string, e: MouseEvent) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    commit(id);
  }

  return (
    <nav className={tocClass({ className })} aria-label="目录">
      {title ? <div className="cf-toc__title">{title}</div> : null}
      <ul className="cf-toc__list">
        {items
          .filter((i) => (i.depth ?? 1) <= maxDepth)
          .map((item) => {
            const cls = [
              'cf-toc__item',
              `cf-toc__item--depth-${item.depth ?? 1}`,
              current === item.id && 'is-active',
            ].filter(Boolean).join(' ');
            return (
              <li key={item.id} className={cls}>
                <a
                  href={`#${item.id}`}
                  className="cf-toc__link"
                  onClick={(e) => scrollTo(item.id, e)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
