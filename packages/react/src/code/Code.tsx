import { useState, type CSSProperties } from 'react';
import {
  codeBlockClass,
  type CodeBlockProps,
  type InlineCodeProps,
} from './variants';

export function InlineCode(props: InlineCodeProps) {
  const { size = 'md', className, children } = props;
  return (
    <code className={['cf-code', `cf-code--${size}`, className].filter(Boolean).join(' ')}>
      {children}
    </code>
  );
}

export function CodeBlock(props: CodeBlockProps) {
  const {
    code,
    language,
    title,
    size = 'md',
    showLineNumbers = false,
    copyable = true,
    maxHeight,
    className,
  } = props;

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const lines = code.split('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch (e) {
      /* swallow */
    }
  }

  const preStyle: CSSProperties | undefined =
    maxHeight != null
      ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
      : undefined;

  const cls = codeBlockClass({ size, showLineNumbers, className });

  return (
    <div className={cls}>
      {title || language || copyable ? (
        <header className="cf-code-block__header">
          {title ? <span className="cf-code-block__title">{title}</span> : null}
          {language ? <span className="cf-code-block__lang">{language}</span> : null}
          {copyable ? (
            <button
              type="button"
              className="cf-code-block__copy"
              aria-label={copyState === 'copied' ? '已复制' : '复制代码'}
              onClick={copy}
            >
              {copyState === 'copied' ? '已复制' : '复制'}
            </button>
          ) : null}
        </header>
      ) : null}
      <pre className="cf-code-block__pre" style={preStyle}>
        {showLineNumbers ? (
          <span className="cf-code-block__nums" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </span>
        ) : null}
        <code className="cf-code-block__code">{code}</code>
      </pre>
    </div>
  );
}
