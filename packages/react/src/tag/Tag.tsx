import { forwardRef } from 'react';
import { tagClass, type TagProps } from './variants';

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(props, ref) {
  const {
    variant = 'soft',
    size = 'md',
    tone = 'neutral',
    closable = false,
    rounded = false,
    leading,
    onClose,
    children,
    className,
    ...rest
  } = props;

  return (
    <span
      ref={ref}
      className={tagClass({ variant, size, tone, rounded, className })}
      {...rest}
    >
      {leading ? <span className="ck-tag__leading">{leading}</span> : null}
      {children}
      {closable ? (
        <button
          type="button"
          className="ck-tag__close"
          aria-label="关闭"
          onClick={onClose}
        >
          ×
        </button>
      ) : null}
    </span>
  );
});
