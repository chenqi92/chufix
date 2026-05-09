import { useMemo } from 'react';
import { parseAnsi, spanClass, type AnsiTextProps } from './variants';

export function AnsiText(props: AnsiTextProps) {
  const {
    text,
    size = 'md',
    wrap = true,
    preserveWhitespace = true,
    className,
  } = props;

  const spans = useMemo(() => parseAnsi(text), [text]);

  const cls = [
    'cf-ansi',
    `cf-ansi--${size}`,
    wrap && 'is-wrap',
    preserveWhitespace && 'is-pre',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <pre className={cls}>
      {spans.map((span, i) => (
        <span key={i} className={spanClass(span)}>
          {span.text}
        </span>
      ))}
    </pre>
  );
}
