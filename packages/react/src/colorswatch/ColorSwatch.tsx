import { forwardRef } from 'react';
import {
  colorSwatchClass,
  colorSwatchDefaults,
  type ColorSwatchProps,
} from './variants';

export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(
  function ColorSwatch(props, ref) {
    const {
      color,
      size = colorSwatchDefaults.size,
      shape = colorSwatchDefaults.shape,
      selected,
      add,
      label,
      className,
      style,
      disabled,
      'aria-label': ariaLabelProp,
      ...rest
    } = props;

    const cls = colorSwatchClass({ size, shape, selected, add, className });
    const mergedStyle =
      color && !add ? { ...(style ?? {}), background: color } : style;
    const ariaLabel =
      ariaLabelProp ?? label ?? color ?? (add ? '添加颜色' : '颜色');

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={mergedStyle}
        aria-label={ariaLabel}
        aria-pressed={selected || undefined}
        disabled={disabled}
        {...rest}
      >
        {add ? (
          <svg
            className="cf-swatch__plus"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </svg>
        ) : null}
      </button>
    );
  },
);
