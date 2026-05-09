import { useEffect, useRef, useState } from 'react';
import { backTopClass, smoothScrollTo, type BackTopProps } from './variants';

export function BackTop(props: BackTopProps) {
  const {
    visibilityHeight = 200,
    target,
    size = 'md',
    duration = 320,
    className,
    onClick,
    children,
  } = props;

  const [visible, setVisible] = useState(false);
  const scopeRef = useRef<Window | Element>(window);

  useEffect(() => {
    let scope: Window | Element = window;
    if (target) {
      const el = document.querySelector(target);
      if (el) scope = el;
    }
    scopeRef.current = scope;
    function update() {
      const y = scope instanceof Window ? window.scrollY : (scope as Element).scrollTop;
      setVisible(y > visibilityHeight);
    }
    scope.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      scope.removeEventListener('scroll', update);
    };
  }, [target, visibilityHeight]);

  function handleClick() {
    smoothScrollTo(scopeRef.current, 0, duration);
    onClick?.();
  }

  return (
    <button
      type="button"
      className={backTopClass({ size, visible, className })}
      aria-label="返回顶部"
      onClick={handleClick}
    >
      {children ?? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5l-6 6h4v8h4v-8h4z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
