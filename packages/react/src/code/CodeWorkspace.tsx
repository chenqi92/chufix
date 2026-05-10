import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CodeEditor } from '../codeeditor/CodeEditor';
import { CodeBlock } from './Code';
import {
  buildCodeTree,
  codeFileId,
  codeFileLanguage,
  codeFileName,
  codeWorkspaceClass,
  normalizeCodeIndent,
  type CodeWorkspaceFile,
  type CodeWorkspaceProps,
} from './variants';

export function CodeWorkspace(props: CodeWorkspaceProps) {
  const {
    files,
    activeFile,
    defaultFile,
    title,
    rootLabel = 'project',
    size = 'md',
    showLineNumbers = true,
    copyable = true,
    editable = false,
    readOnly = false,
    wrap = false,
    tone = 'light',
    trimIndent = false,
    highlight = true,
    height,
    className,
    onActiveFileChange,
    onFileChange,
    renderCode,
  } = props;

  const fallbackId = files[0] ? codeFileId(files[0]) : '';
  const [innerActive, setInnerActive] = useState(activeFile ?? defaultFile ?? fallbackId);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (activeFile) setInnerActive(activeFile);
  }, [activeFile]);

  useEffect(() => {
    if (!files.some((file) => codeFileId(file) === innerActive)) {
      setInnerActive(fallbackId);
    }
  }, [fallbackId, files, innerActive]);

  const activeId = activeFile ?? innerActive;
  const current = files.find((file) => codeFileId(file) === activeId) ?? files[0];
  const language = current ? codeFileLanguage(current) : 'plaintext';
  const treeItems = useMemo(() => buildCodeTree(files), [files]);

  const activeCode = current
    ? trimIndent && !editable
      ? normalizeCodeIndent(draftValues[codeFileId(current)] ?? current.content)
      : draftValues[codeFileId(current)] ?? current.content
    : '';

  const cls = codeWorkspaceClass({
    size,
    showLineNumbers,
    editable,
    wrap,
    tone,
    className,
  });
  const rootStyle = height != null
    ? { height: typeof height === 'number' ? `${height}px` : height }
    : undefined;

  function selectFile(file?: CodeWorkspaceFile) {
    if (!file) return;
    const id = codeFileId(file);
    setInnerActive(id);
    onActiveFileChange?.(file);
  }

  function updateCode(value: string) {
    if (!current) return;
    const id = codeFileId(current);
    setDraftValues((drafts) => ({ ...drafts, [id]: value }));
    onFileChange?.(current, value);
  }

  async function copy() {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch (e) {
      /* clipboard blocked */
    }
  }

  return (
    <div className={cls} style={rootStyle}>
      {title || copyable ? (
        <header className="cf-code-workspace__header">
          <div className="cf-code-workspace__title">
            <span className="cf-code-workspace__traffic" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            {title ? <span>{title}</span> : null}
          </div>
          {copyable && current ? (
            <button
              type="button"
              className="cf-code-workspace__copy"
              aria-label={copyState === 'copied' ? '已复制' : '复制代码'}
              onClick={copy}
            >
              {copyState === 'copied' ? '已复制' : '复制'}
            </button>
          ) : null}
        </header>
      ) : null}

      <div className="cf-code-workspace__shell">
        <aside className="cf-code-workspace__tree" aria-label="Code files">
          <div className="cf-code-workspace__root">
            <span className="cf-code-workspace__folder-icon" aria-hidden="true" />
            <span>{rootLabel}</span>
          </div>
          {treeItems.map((item) =>
            item.kind === 'folder' ? (
              <div
                key={item.id}
                className="cf-code-workspace__folder"
                style={{ '--cf-code-tree-indent': `${item.depth * 14}px` } as CSSProperties}
              >
                <span className="cf-code-workspace__folder-icon" aria-hidden="true" />
                <span>{item.name}</span>
              </div>
            ) : (
              <button
                key={item.id}
                type="button"
                className="cf-code-workspace__file"
                style={{ '--cf-code-tree-indent': `${item.depth * 14}px` } as CSSProperties}
                aria-selected={item.file && codeFileId(item.file) === activeId ? 'true' : 'false'}
                onClick={() => selectFile(item.file)}
              >
                <span className="cf-code-workspace__file-dot" aria-hidden="true" />
                <span className="cf-code-workspace__file-name">{item.name}</span>
              </button>
            ),
          )}
        </aside>

        <section className="cf-code-workspace__editor" aria-live="polite">
          {current ? (
            <div className="cf-code-workspace__tabs" role="tablist">
              {files.map((file) => (
                <button
                  key={codeFileId(file)}
                  type="button"
                  className="cf-code-workspace__tab"
                  aria-selected={codeFileId(file) === activeId ? 'true' : 'false'}
                  onClick={() => selectFile(file)}
                >
                  {codeFileName(file.name)}
                </button>
              ))}
            </div>
          ) : null}

          {current ? (
            <div className="cf-code-workspace__meta">
              <span>{current.name}</span>
              <span className="cf-code-workspace__lang">{language}</span>
            </div>
          ) : null}

          <div className="cf-code-workspace__body">
            {editable && current ? (
              <CodeEditor
                value={activeCode}
                language={language}
                showLineNumbers={showLineNumbers}
                readOnly={readOnly || current.readonly}
                wrap={wrap}
                rows={18}
                onChange={updateCode}
              />
            ) : current ? (
              renderCode?.(current) ?? (
                <CodeBlock
                  code={current.content}
                  language={language}
                  showLineNumbers={showLineNumbers}
                  copyable={false}
                  wrap={wrap}
                  tone={tone}
                  trimIndent={trimIndent}
                  highlight={highlight}
                  highlightedHtml={current.highlightedHtml}
                  className="cf-code-workspace__block"
                />
              )
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
