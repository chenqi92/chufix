import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { affixClass, type AffixProps } from './variants';

export function Affix(props: AffixProps) {
  const { offsetTop, offsetBottom, target, zIndex = 100, className, onChange, children } = props;
  const [fixed, setFixed] = useState(false);
  const [innerStyle, setInnerStyle] = useState<CSSProperties>({});
  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties | undefined>(undefined);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<Window | Element>(window);

  const update = () => {
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    const rect = placeholder.getBoundingClientRect();
    const scope = scopeRef.current;

    const viewportTop = scope instanceof Window ? 0 : (scope as Element).getBoundingClientRect().top;
    const viewportBottom =
      scope instanceof Window ? window.innerHeight : (scope as Element).getBoundingClientRect().bottom;

    if (offsetTop !== undefined) {
      const shouldFix = rect.top < viewportTop + offsetTop;
      setFixed((prev) => {
        if (prev !== shouldFix) onChange?.(shouldFix);
        return shouldFix;
      });
      if (shouldFix) {
        setInnerStyle({
          position: 'fixed',
          top: viewportTop + offsetTop,
          left: rect.left,
          width: rect.width,
          zIndex,
        });
        setPlaceholderStyle({ width: rect.width, height: rect.height });
      } else {
        setInnerStyle({});
        setPlaceholderStyle(undefined);
      }
      return;
    }
    if (offsetBottom !== undefined) {
      const shouldFix = rect.bottom > viewportBottom - offsetBottom;
      setFixed((prev) => {
        if (prev !== shouldFix) onChange?.(shouldFix);
        return shouldFix;
      });
      if (shouldFix) {
        setInnerStyle({
          position: 'fixed',
          bottom:
            (scope instanceof Window ? 0 : window.innerHeight - viewportBottom) + offsetBottom,
          left: rect.left,
          width: rect.width,
          zIndex,
        });
        setPlaceholderStyle({ width: rect.width, height: rect.height });
      } else {
        setInnerStyle({});
        setPlaceholderStyle(undefined);
      }
    }
  };

  useLayoutEffect(() => {
    let scope: Window | Element = window;
    if (target) {
      const el = document.querySelector(target);
      if (el) scope = el;
    }
    scopeRef.current = scope;
    scope.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      scope.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, offsetTop, offsetBottom, zIndex]);

  return (
    <div
      ref={placeholderRef}
      className={affixClass({ fixed, className })}
      style={placeholderStyle}
    >
      <div style={innerStyle}>{children}</div>
    </div>
  );
}
