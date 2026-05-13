import type { CSSProperties } from 'react';
import { paragraphClass, type ParagraphProps } from './variants';

export function Paragraph(props: ParagraphProps) {
  const { children, className, lineClamp } = props;
  const cls = [paragraphClass(props), className].filter(Boolean).join(' ');
  const style: CSSProperties | undefined =
    lineClamp && lineClamp > 0
      ? {
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lineClamp,
          overflow: 'hidden',
        }
      : undefined;
  return (
    <p className={cls} style={style}>
      {children}
    </p>
  );
}
