import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { anchorClass, type AnchorItem, type AnchorProps } from './variants';

function flatten(items: AnchorItem[]): AnchorItem[] {
  const out: AnchorItem[] = [];
  for (const it of items) {
    out.push(it);
    if (it.children?.length) out.push(...flatten(it.children));
  }
  return out;
}

function hashId(href: string): string {
  return href.startsWith('#') ? href.slice(1) : href;
}

export function Anchor({
  items,
  offsetTop = 0,
  bounds = 5,
  target,
  className,
  onChange,
}: AnchorProps) {
  const [active, setActive] = useState<string>('');
  const scopeRef = useRef<Window | Element | null>(null);

  const update = useCallback(() => {
    if (!scopeRef.current) return;
    const flat = flatten(items);
    let chosen = '';
    for (const it of flat) {
      const el = document.getElementById(hashId(it.href));
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top - offsetTop <= bounds) chosen = it.href;
    }
    if (chosen) {
      setActive((prev) => {
        if (prev !== chosen) onChange?.(chosen);
        return chosen;
      });
    } else if (flat[0]) {
      setActive(flat[0].href);
    }
  }, [items, offsetTop, bounds, onChange]);

  useEffect(() => {
    let scope: Window | Element = window;
    if (target) {
      const el = document.querySelector(target);
      if (el) scope = el;
    }
    scopeRef.current = scope;
    scope.addEventListener('scroll', update, { passive: true } as AddEventListenerOptions);
    update();
    return () => {
      scope.removeEventListener('scroll', update);
    };
  }, [target, update]);

  function onClick(evt: MouseEvent<HTMLAnchorElement>, href: string) {
    evt.preventDefault();
    const el = document.getElementById(hashId(href));
    if (!el) return;
    if (history?.pushState) history.pushState(null, '', href);
    const scope = scopeRef.current;
    const rect = el.getBoundingClientRect();
    const targetTop =
      (scope instanceof Window || !scope ? window.scrollY : (scope as Element).scrollTop) +
      rect.top -
      offsetTop;
    if (scope instanceof Window || !scope) {
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      (scope as Element).scrollTo({ top: targetTop, behavior: 'smooth' });
    }
    setActive(href);
    onChange?.(href);
  }

  const cls = anchorClass({ className });
  return (
    <nav className={cls}>
      <ul className="cf-anchor__list">
        {items.map((item) => (
          <li key={item.href} className="cf-anchor__item">
            <a
              href={item.href}
              className={`cf-anchor__link${active === item.href ? ' is-active' : ''}`}
              onClick={(e) => onClick(e, item.href)}
            >{item.label}</a>
            {item.children?.length ? (
              <ul className="cf-anchor__list cf-anchor__list--nested">
                {item.children.map((child) => (
                  <li key={child.href} className="cf-anchor__item">
                    <a
                      href={child.href}
                      className={`cf-anchor__link cf-anchor__link--nested${active === child.href ? ' is-active' : ''}`}
                      onClick={(e) => onClick(e, child.href)}
                    >{child.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
