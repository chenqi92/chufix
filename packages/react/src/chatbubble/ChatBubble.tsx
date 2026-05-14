import { alignFromRole, formatTimestamp, resolveInitials, type ChatBubbleProps } from './variants';

export function ChatBubble(props: ChatBubbleProps) {
  const {
    role,
    content,
    timestamp,
    author,
    state = 'sent',
    showCopy = true,
    showActions = true,
    align: alignProp = 'auto',
    onCopy,
    onRetry,
    onEdit,
    onBranch,
    onAction,
    children,
  } = props;

  const align = alignFromRole(role, alignProp);
  const time = formatTimestamp(timestamp);
  const initials = resolveInitials(author, role);

  async function handleCopy() {
    if (content && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(content);
      } catch {
        /* clipboard blocked */
      }
    }
    onCopy?.();
    onAction?.('copy');
  }
  function handleRetry() { onRetry?.(); onAction?.('retry'); }
  function handleEdit()  { onEdit?.();  onAction?.('edit'); }
  function handleBranch(){ onBranch?.();onAction?.('branch'); }

  return (
    <div
      className={[
        'cf-chatbubble',
        `cf-chatbubble--${role}`,
        `cf-chatbubble--align-${align}`,
        `cf-chatbubble--state-${state}`,
      ].join(' ')}
      data-state={state}
    >
      <div className="cf-chatbubble__avatar" aria-hidden>
        {author?.avatar ? (
          <img src={author.avatar} alt={author.name ?? ''} />
        ) : (
          <span className="cf-chatbubble__initials">{initials}</span>
        )}
      </div>
      <div className="cf-chatbubble__main">
        {(author?.name || time) && (
          <div className="cf-chatbubble__meta">
            {author?.name && <span className="cf-chatbubble__name">{author.name}</span>}
            {time && <span className="cf-chatbubble__time">{time}</span>}
          </div>
        )}
        <div className="cf-chatbubble__body" data-role={role}>
          {children ?? content}
          {state === 'streaming' && <span className="cf-chatbubble__cursor" aria-hidden />}
        </div>
        {state === 'error' && (
          <div className="cf-chatbubble__error">
            消息发送失败。
            {showActions && (
              <button type="button" className="cf-chatbubble__error-retry" onClick={handleRetry}>
                重试
              </button>
            )}
          </div>
        )}
        {(showActions || showCopy) && (
          <div className="cf-chatbubble__actions">
            {showCopy && (
              <button type="button" className="cf-chatbubble__action" aria-label="复制" onClick={handleCopy}>
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <path d="M5 1h6a2 2 0 012 2v8H5a2 2 0 01-2-2V3a2 2 0 012-2zm0 14h6a2 2 0 002-2V11H5a2 2 0 00-2 2v0a2 2 0 002 2z" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round"/>
                </svg>
                复制
              </button>
            )}
            {showActions && role === 'assistant' && state !== 'streaming' && (
              <button type="button" className="cf-chatbubble__action" aria-label="重试" onClick={handleRetry}>
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <path d="M3 8a5 5 0 019-3l1 1V3M13 8a5 5 0 01-9 3l-1-1v3" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                重试
              </button>
            )}
            {showActions && role === 'user' && (
              <button type="button" className="cf-chatbubble__action" aria-label="编辑" onClick={handleEdit}>
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <path d="M2 12l2-1 7-7 1 2-1 1-7 7-2-2zM12 4l2-2 1 1-2 2" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round"/>
                </svg>
                编辑
              </button>
            )}
            {showActions && (
              <button type="button" className="cf-chatbubble__action" aria-label="分支" onClick={handleBranch}>
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <path d="M4 3v6m0 4a2 2 0 100-4 2 2 0 000 4zm0-8a1 1 0 110-2 1 1 0 010 2zm8 0v6a3 3 0 01-3 3H6m6-9a1 1 0 110-2 1 1 0 010 2z" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round"/>
                </svg>
                分支
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
