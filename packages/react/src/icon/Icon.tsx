import { forwardRef, useId } from 'react';
import { iconSymbols } from '@chufix/icons';
import { iconClass, iconStyle, type IconProps } from './variants';

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
  const {
    name,
    size = 'md',
    strokeWidth = 1.5,
    color,
    motion,
    title,
    className,
    style,
    role,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...rest
  } = props;
  const titleId = useId();
  const hasAccessibleName = Boolean(title || ariaLabel);

  return (
    <svg
      ref={ref}
      className={iconClass({ size, motion, className })}
      style={iconStyle(size, color, style)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={role ?? (hasAccessibleName ? 'img' : undefined)}
      aria-label={ariaLabel}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      {...rest}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g dangerouslySetInnerHTML={{ __html: iconSymbols[name] }} />
    </svg>
  );
});
