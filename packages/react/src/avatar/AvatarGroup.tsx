import type { CSSProperties } from 'react';
import type { AvatarGroupProps } from './variants';

export function AvatarGroup(props: AvatarGroupProps) {
  const { spacing = -8, children, className, style } = props;
  const groupStyle: CSSProperties = {
    ...style,
    ['--cf-LEGACY-avatar-spacing' as any]: `${spacing}px`,
  };
  const cls = ['cf-avatar-group', className].filter(Boolean).join(' ');

  return (
    <span className={cls} style={groupStyle}>
      {children}
    </span>
  );
}
