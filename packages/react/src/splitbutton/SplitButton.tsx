import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as RMouseEvent,
} from 'react';
import {
  splitButtonClass,
  splitButtonDefaults,
  type SplitButtonItem,
  type SplitButtonProps,
} from './variants';

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  function SplitButton(props, ref) {
    const {
      variant = splitButtonDefaults.variant,
      size = splitButtonDefaults.size,
      items,
      disabled,
      loading,
      onClick,
      onSelect,
      children,
      className,
      ...rest
    } = props;

    const inactive = disabled || loading;
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const cls = splitButtonClass({
      variant,
      size,
      disabled,
      loading,
      className,
    });

    const closeMenu = useCallback(() => setOpen(false), []);

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: globalThis.MouseEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) closeMenu();
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open, closeMenu]);

    const handleMain = (e: RMouseEvent<HTMLButtonElement>) => {
      if (inactive) return;
      onClick?.(e);
    };

    const handleToggle = () => {
      if (inactive) return;
      setOpen((v) => !v);
    };

    const pick = (item: SplitButtonItem) => {
      if (item.disabled) return;
      onSelect?.(item.value, item);
      setOpen(false);
    };

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cls}
        {...rest}
      >
        <button
          type="button"
          className="cf-splitbtn__main"
          disabled={inactive}
          aria-busy={loading || undefined}
          onClick={handleMain}
        >
          {children}
        </button>
        <span className="cf-splitbtn__div" aria-hidden="true" />
        <button
          type="button"
          className="cf-splitbtn__more"
          disabled={inactive}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="更多操作"
          onClick={handleToggle}
        >
          <svg
            className="cf-splitbtn__caret"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth={1.6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open ? (
          <ul className="cf-splitbtn__menu" role="menu">
            {items.map((item) => (
              <li
                key={item.value}
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                className={[
                  'cf-splitbtn__option',
                  item.disabled && 'is-disabled',
                  item.danger && 'is-danger',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(item);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
