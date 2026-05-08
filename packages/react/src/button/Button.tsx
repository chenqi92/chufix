import { forwardRef } from 'react';
import { buttonClass, buttonDefaults, type ButtonProps } from './variants';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const {
    variant = buttonDefaults.variant,
    size = buttonDefaults.size,
    shape = buttonDefaults.shape,
    tone = buttonDefaults.tone,
    loading = false,
    block = false,
    disabled,
    leading,
    trailing,
    className,
    type = 'button',
    children,
    onClick,
    ...rest
  } = props;

  const isInactive = disabled || loading;
  const cls = buttonClass({ variant, size, shape, tone, loading, block, className });

  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      disabled={isInactive}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (isInactive) return;
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <span className="cf-btn__spinner" aria-hidden />
      ) : leading ? (
        <span className="cf-btn__leading">{leading}</span>
      ) : null}
      <span className="cf-btn__label">{children}</span>
      {trailing ? <span className="cf-btn__trailing">{trailing}</span> : null}
    </button>
  );
});
