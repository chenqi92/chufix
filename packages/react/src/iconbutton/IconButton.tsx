import { forwardRef } from 'react';
import {
  iconButtonClass,
  iconButtonDefaults,
  type IconButtonProps,
} from './variants';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const {
      variant = iconButtonDefaults.variant,
      size = iconButtonDefaults.size,
      shape = iconButtonDefaults.shape,
      pressed,
      loading = false,
      disabled,
      badge,
      className,
      type = 'button',
      children,
      onClick,
      ...rest
    } = props;

    const inactive = disabled || loading;
    const cls = iconButtonClass({ variant, size, shape, loading, className });

    return (
      <button
        ref={ref}
        type={type}
        className={cls}
        disabled={inactive}
        aria-pressed={pressed}
        aria-busy={loading || undefined}
        onClick={(e) => {
          if (inactive) return;
          onClick?.(e);
        }}
        {...rest}
      >
        {children}
        {badge != null ? <span className="cf-iconbtn__badge">{badge}</span> : null}
      </button>
    );
  },
);
