import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  navMenuClass,
  type NavMenuItem,
  type NavMenuProps,
} from './variants';

export function NavMenu(props: NavMenuProps) {
  const {
    items,
    active,
    variant = 'underline',
    trigger = 'hover',
    className,
    onNavigate,
  } = props;

  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function open(key: string) {
    clearCloseTimer();
    setOpenKey(key);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpenKey(null), 120);
  }

  useEffect(() => {
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      clearCloseTimer();
    };
  }, []);

  function handleTriggerEnter(item: NavMenuItem) {
    if (trigger !== 'hover' || !item.links?.length || item.disabled) return;
    open(item.key);
  }

  function handleTriggerClick(item: NavMenuItem) {
    if (item.disabled) return;
    if (item.links?.length) {
      setOpenKey((k) => (k === item.key ? null : item.key));
    } else {
      onNavigate?.(item);
    }
  }

  function handleTriggerLeave() {
    if (trigger !== 'hover') return;
    scheduleClose();
  }

  const openItem = items.find((i) => i.key === openKey) ?? null;
  const cols = openItem?.columns ?? 2;
  const panelStyle: CSSProperties = {
    ['--cf-navmenu-cols' as never]: String(cols),
  };

  return (
    <nav
      ref={rootRef}
      className={navMenuClass({ variant, className })}
      aria-label="主导航"
    >
      <ul className="cf-navmenu__list">
        {items.map((item) => {
          const cls = [
            'cf-navmenu__item',
            active === item.key && 'is-active',
            item.disabled && 'is-disabled',
            openKey === item.key && 'is-open',
          ].filter(Boolean).join(' ');
          return (
            <li
              key={item.key}
              className={cls}
              onMouseEnter={() => handleTriggerEnter(item)}
              onMouseLeave={handleTriggerLeave}
            >
              {item.links?.length ? (
                <button
                  type="button"
                  className="cf-navmenu__trigger"
                  aria-haspopup="true"
                  aria-expanded={openKey === item.key}
                  onClick={() => handleTriggerClick(item)}
                >
                  <span>{item.label}</span>
                  <svg viewBox="0 0 16 16" className="cf-navmenu__caret" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <a
                  className="cf-navmenu__trigger"
                  href={item.href ?? '#'}
                  aria-disabled={item.disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTriggerClick(item);
                  }}
                >
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {openItem && openItem.links?.length ? (
        <div
          className="cf-navmenu__panel"
          style={panelStyle}
          onMouseEnter={() => clearCloseTimer()}
          onMouseLeave={handleTriggerLeave}
        >
          {openItem.links.map((link) => (
            <a key={link.href} href={link.href} className="cf-navmenu__link">
              {link.icon ? (
                <span className="cf-navmenu__link-icon">{link.icon}</span>
              ) : null}
              <span className="cf-navmenu__link-body">
                <span className="cf-navmenu__link-label">{link.label}</span>
                {link.description ? (
                  <span className="cf-navmenu__link-description">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
