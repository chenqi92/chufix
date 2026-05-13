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
  type CodeWorkspaceBundle,
  type CodeWorkspaceFile,
  type CodeWorkspaceProps,
} from './variants';

export function CodeWorkspace(props: CodeWorkspaceProps) {
  const {
    files,
    bundles,
    activeFile,
    defaultFile,
    activeBundle,
    defaultBundle,
    title,
    rootLabel = 'project',
    size = 'md',
    showLineNumbers = true,
    copyable = true,
    editable = false,
    readOnly = false,
    wrap = false,
    tone = 'auto',
    trimIndent = false,
    highlight = true,
    height,
    className,
    onActiveFileChange,
    onActiveBundleChange,
    onFileChange,
    renderCode,
  } = props;

  const isBundleMode = !!(bundles && bundles.length > 0);
  const bundleList: CodeWorkspaceBundle[] = bundles ?? [];

  /* ---------- bundle 状态 ---------- */
  const initialBundleId = useMemo(() => {
    if (!isBundleMode) return '';
    if (activeBundle && bundleList.some((b) => b.id === activeBundle)) return activeBundle;
    if (defaultBundle && bundleList.some((b) => b.id === defaultBundle)) return defaultBundle;
    return bundleList[0]?.id ?? '';
    // 仅在初始/外部 active 切换时重算
  }, [isBundleMode, activeBundle, defaultBundle, bundleList]);

  const [innerBundle, setInnerBundle] = useState(initialBundleId);

  useEffect(() => {
    if (activeBundle && bundleList.some((b) => b.id === activeBundle)) {
      setInnerBundle(activeBundle);
    }
  }, [activeBundle, bundleList]);
  useEffect(() => {
    if (!bundleList.some((b) => b.id === innerBundle)) {
      setInnerBundle(bundleList[0]?.id ?? '');
    }
  }, [bundleList, innerBundle]);

  const currentBundleId = activeBundle ?? innerBundle;
  const currentBundle = bundleList.find((b) => b.id === currentBundleId);

  /* ---------- framework / variant tab ---------- */
  const frameworkOrder = useMemo(() => {
    const out: string[] = [];
    for (const b of bundleList) {
      if (b.framework === 'neutral') continue;
      if (!out.includes(b.framework as string)) out.push(b.framework as string);
    }
    return out;
  }, [bundleList]);
  const frameworkLabel = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of bundleList) {
      if (b.framework === 'neutral') continue;
      if (map[b.framework as string] == null) map[b.framework as string] = b.frameworkLabel;
    }
    return map;
  }, [bundleList]);
  const currentFramework = currentBundle?.framework ?? 'neutral';
  const showFrameworkTabs = isBundleMode && frameworkOrder.length > 1;
  const showVariantTabs = isBundleMode && bundleList.some((b) => {
    if (b.framework === 'neutral') return false;
    return bundleList.some(
      (o) => o !== b && o.framework === b.framework && o.variant !== b.variant,
    );
  });

  function firstBundleOfFramework(framework: string): string {
    return bundleList.find((b) => b.framework === framework)?.id ?? '';
  }

  function selectBundle(id: string) {
    if (!id || id === currentBundleId) return;
    setInnerBundle(id);
    onActiveBundleChange?.(id);
    const next = bundleList.find((b) => b.id === id);
    const firstFile = next?.files[0];
    if (firstFile) {
      const fid = codeFileId(firstFile);
      setInnerActive(fid);
      onActiveFileChange?.(firstFile);
    }
  }

  /* ---------- 可见 files ---------- */
  const visibleFiles: CodeWorkspaceFile[] = isBundleMode ? (currentBundle?.files ?? []) : (files ?? []);

  const fallbackId = visibleFiles[0] ? codeFileId(visibleFiles[0]) : '';
  const [innerActive, setInnerActive] = useState(activeFile ?? defaultFile ?? fallbackId);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (activeFile) setInnerActive(activeFile);
  }, [activeFile]);

  useEffect(() => {
    if (!visibleFiles.some((file) => codeFileId(file) === innerActive)) {
      setInnerActive(fallbackId);
    }
  }, [fallbackId, visibleFiles, innerActive]);

  const activeId = activeFile ?? innerActive;
  const current = visibleFiles.find((file) => codeFileId(file) === activeId) ?? visibleFiles[0];
  const language = current ? codeFileLanguage(current) : 'plaintext';
  const treeItems = useMemo(() => buildCodeTree(visibleFiles), [visibleFiles]);

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
    <div
      className={cls}
      style={rootStyle}
      data-active-framework={currentFramework}
      data-active-bundle={currentBundleId || undefined}
    >
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

      {(showFrameworkTabs || showVariantTabs) ? (
        <div className="cf-code-workspace__bundles" role="tablist" aria-label="Framework">
          {showFrameworkTabs ? (
            <div className="cf-code-workspace__frameworks">
              {frameworkOrder.map((framework) => (
                <button
                  key={framework}
                  type="button"
                  className="cf-code-workspace__framework-tab"
                  aria-selected={currentFramework === framework ? 'true' : 'false'}
                  onClick={() => selectBundle(firstBundleOfFramework(framework))}
                >
                  {frameworkLabel[framework]}
                </button>
              ))}
            </div>
          ) : null}
          {showVariantTabs ? (
            <div className="cf-code-workspace__variants">
              {bundleList.map((bundle) =>
                bundle.framework !== 'neutral' && bundle.framework === currentFramework ? (
                  <button
                    key={bundle.id}
                    type="button"
                    className="cf-code-workspace__variant-tab"
                    aria-selected={bundle.id === currentBundleId ? 'true' : 'false'}
                    onClick={() => selectBundle(bundle.id)}
                  >
                    {bundle.variantLabel}
                  </button>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
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
              {visibleFiles.map((file) => (
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
