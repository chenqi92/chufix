import { useMemo } from 'react';
import {
  renderMarkdown,
  type MarkdownEditorMode,
  type MarkdownEditorProps,
} from './variants';

export function MarkdownEditor(props: MarkdownEditorProps) {
  const {
    value,
    onChange,
    mode = 'split',
    onModeChange,
    size = 'md',
    placeholder = '在此输入 Markdown…',
    rows = 14,
    readOnly = false,
    render,
    className,
  } = props;

  const html = useMemo(
    () => (render ? render(value) : renderMarkdown(value)),
    [value, render],
  );

  const cls = [
    'cf-md',
    `cf-md--${size}`,
    `cf-md--${mode}`,
    readOnly && 'is-readonly',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const setMode = (m: MarkdownEditorMode) => onModeChange?.(m);

  return (
    <div className={cls}>
      <div
        className="cf-md__toolbar"
        role="toolbar"
        aria-label="Markdown 视图模式"
      >
        <button
          type="button"
          className="cf-md__btn"
          aria-pressed={mode === 'edit'}
          onClick={() => setMode('edit')}
        >
          编辑
        </button>
        <button
          type="button"
          className="cf-md__btn"
          aria-pressed={mode === 'split'}
          onClick={() => setMode('split')}
        >
          分屏
        </button>
        <button
          type="button"
          className="cf-md__btn"
          aria-pressed={mode === 'preview'}
          onClick={() => setMode('preview')}
        >
          预览
        </button>
      </div>
      <div className="cf-md__body">
        {mode !== 'preview' ? (
          <textarea
            className="cf-md__edit"
            value={value}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : null}
        {mode !== 'edit' ? (
          <div
            className="cf-md__preview cf-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </div>
    </div>
  );
}
