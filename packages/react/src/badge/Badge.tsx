import {
  badgeClass,
  badgeRootClass,
  formatBadgeContent,
  type BadgeProps,
} from './variants';
import type { CSSProperties } from 'react';

export function Badge(props: BadgeProps) {
  const {
    tone = 'danger',
    dot = false,
    content,
    max = 99,
    showZero = false,
    placement = 'top-right',
    offset,
    children,
    className,
    style,
  } = props;

  const wrap = children != null && children !== false;
  const text = formatBadgeContent(content, max);
  const visible = dot || (text !== undefined && (text !== '0' || showZero));

  const offsetStyle: CSSProperties | undefined = wrap && offset
    ? { transform: `translate(${offset[0]}px, ${offset[1]}px)` }
    : undefined;

  return (
    <span className={badgeRootClass({ wrap, className })} style={style}>
      {children}
      {visible ? (
        <span
          className={badgeClass({ tone, dot, placement, wrap })}
          style={offsetStyle}
        >
          {dot ? null : text}
        </span>
      ) : null}
    </span>
  );
}
