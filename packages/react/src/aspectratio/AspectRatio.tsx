import { type CSSProperties } from 'react';
import type { AspectRatioProps } from './variants';

export function AspectRatio(props: AspectRatioProps) {
  const { ratio = 16 / 9, className, children } = props;
  const styles: CSSProperties = { ['--cf-aspect' as never]: String(ratio) };
  return (
    <div className={['cf-aspect', className].filter(Boolean).join(' ')} style={styles}>
      <div className="cf-aspect__inner">{children}</div>
    </div>
  );
}
