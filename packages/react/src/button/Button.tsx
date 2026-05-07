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
        <span className="ck-btn__spinner" aria-hidden />
      ) : leading ? (
        <span className="ck-btn__leading">{leading}</span>
      ) : null}
      <span className="ck-btn__label">{children}</span>
      {trailing ? <span className="ck-btn__trailing">{trailing}</span> : null}
    </button>
  );
});
