import {
  KIND_ICON_PATH,
  KIND_LABEL,
  type ArtifactCardProps,
} from './variants';

function guessExt(kind: string, lang?: string): string {
  if (lang) return `.${lang}`;
  if (kind === 'svg') return '.svg';
  if (kind === 'html') return '.html';
  if (kind === 'json') return '.json';
  if (kind === 'csv') return '.csv';
  return '.txt';
}

export function ArtifactCard(props: ArtifactCardProps) {
  const {
    kind,
    title,
    language,
    meta,
    content,
    filename,
    actions = { copy: true, download: true, open: true },
    kindLabel,
    onCopy,
    onDownload,
    onOpen,
    children,
  } = props;

  const iconPath = KIND_ICON_PATH[kind];
  const kindLabelText = kindLabel ?? KIND_LABEL[kind];

  async function handleCopy() {
    if (content && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(content);
      } catch {
        /* ignore */
      }
    }
    onCopy?.();
  }

  function handleDownload() {
    if (!content || typeof window === 'undefined') {
      onDownload?.();
      return;
    }
    const mime =
      kind === 'svg'
        ? 'image/svg+xml'
        : kind === 'html'
          ? 'text/html'
          : kind === 'json'
            ? 'application/json'
            : kind === 'csv'
              ? 'text/csv'
              : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? `${title || 'artifact'}${guessExt(kind, language)}`;
    a.click();
    URL.revokeObjectURL(url);
    onDownload?.();
  }

  return (
    <article className={['cf-artifact', `cf-artifact--${kind}`].join(' ')}>
      <header className="cf-artifact__head">
        <span className="cf-artifact__kind" aria-hidden>
          <svg viewBox="0 0 16 16" width={14} height={14}>
            <path d={iconPath} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="cf-artifact__title-block">
          <span className="cf-artifact__title">{title}</span>
          <span className="cf-artifact__meta">
            <span className="cf-artifact__kind-label">{kindLabelText}</span>
            {language && <span className="cf-artifact__lang">{language}</span>}
            {meta && <span className="cf-artifact__meta-extra">{meta}</span>}
          </span>
        </div>
        <div className="cf-artifact__actions">
          {actions.copy && content && (
            <button type="button" className="cf-artifact__action" aria-label="复制" onClick={handleCopy}>
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path d="M5 1h6a2 2 0 012 2v8H5a2 2 0 01-2-2V3a2 2 0 012-2zm0 14h6a2 2 0 002-2V11" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {actions.download && content && (
            <button type="button" className="cf-artifact__action" aria-label="下载" onClick={handleDownload}>
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path d="M8 2v8M4 8l4 4 4-4M3 14h10" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {actions.open && (
            <button type="button" className="cf-artifact__action" aria-label="展开" onClick={() => onOpen?.()}>
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path d="M9 2h5v5M14 2L8 8M7 14H2V9M2 14l6-6" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </header>
      <div className="cf-artifact__preview">{children}</div>
    </article>
  );
}
