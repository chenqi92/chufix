import { useMemo } from 'react';
import { renderInlineMarkdown, type StreamingTextProps } from './variants';

export function StreamingText(props: StreamingTextProps) {
  const { text, done = false, format = 'text', cursor = 'blink', className } = props;

  const html = useMemo(
    () => (format === 'markdown' ? renderInlineMarkdown(text) : null),
    [format, text],
  );

  const cursorClass =
    done || cursor === 'none'
      ? ''
      : cursor === 'block'
        ? 'cf-streaming__cursor cf-streaming__cursor--block'
        : 'cf-streaming__cursor';

  return (
    <span className={['cf-streaming', className].filter(Boolean).join(' ')} aria-live="polite" aria-atomic="false">
      {format === 'markdown' ? (
        <span className="cf-streaming__body" dangerouslySetInnerHTML={{ __html: html ?? '' }} />
      ) : (
        <span className="cf-streaming__body">{text}</span>
      )}
      {!done && cursor !== 'none' && <span className={cursorClass} aria-hidden />}
    </span>
  );
}
