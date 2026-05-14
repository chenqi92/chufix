import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { FabProps } from './variants';

export function Fab(props: FabProps) {
  const {
    icon,
    label,
    extended,
    size = 'md',
    variant = 'primary',
    position = 'bottom-right',
    hideOnScroll = false,
    badge,
    disabled = false,
    ariaLabel,
    onClick,
    children,
  } = props;

  const isExtended = typeof extended === 'boolean' ? extended : Boolean(label);
  const [hidden, setHidden] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    if (!hideOnScroll || typeof window === 'undefined') return;
    lastScrollRef.current = window.scrollY || 0;
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const delta = y - lastScrollRef.current;
      if (Math.abs(delta) > 4) {
        setHidden(delta > 0 && y > 80);
        lastScrollRef.current = y;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hideOnScroll]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    onClick?.(e);
  }

  const showBadge = badge !== undefined && badge !== '' && badge !== 0;

  return (
    <button
      type="button"
      className={[
        'cf-fab',
        `cf-fab--${size}`,
        `cf-fab--${variant}`,
        `cf-fab--${position}`,
        isExtended ? 'cf-fab--extended' : '',
        hidden ? 'is-hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={handleClick}
    >
      {(icon || children) && (
        <span className="cf-fab__icon">{icon ?? children}</span>
      )}
      {isExtended && label && <span className="cf-fab__label">{label}</span>}
      {showBadge && <span className="cf-fab__badge">{badge}</span>}
    </button>
  );
}
