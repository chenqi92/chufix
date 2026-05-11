import { useMemo, useRef, type KeyboardEvent } from 'react';
import {
  buildLineNumbers,
  lineCount,
  type CodeEditorProps,
} from './variants';

export function CodeEditor(props: CodeEditorProps) {
  const {
    value,
    onChange,
    language = 'plaintext',
    size = 'md',
    showLineNumbers = true,
    readOnly = false,
    placeholder = '',
    rows = 12,
    wrap = false,
    tabSize = 2,
    className,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const lines = useMemo(() => buildLineNumbers(lineCount(value)), [value]);

  const cls = [
    'cf-codeeditor',
    `cf-codeeditor--${size}`,
    showLineNumbers && 'cf-codeeditor--gutter',
    readOnly && 'is-readonly',
    wrap && 'is-wrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const onScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && tabSize > 0 && !readOnly) {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const indent = ' '.repeat(tabSize);
      const next = ta.value.slice(0, start) + indent + ta.value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + indent.length;
      });
    }
  };

  return (
    <div className={cls}>
      {showLineNumbers ? (
        <div ref={gutterRef} className="cf-codeeditor__gutter">
          {lines.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      ) : null}
      <textarea
        ref={textareaRef}
        className="cf-codeeditor__input"
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        spellCheck={false}
        data-language={language}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
