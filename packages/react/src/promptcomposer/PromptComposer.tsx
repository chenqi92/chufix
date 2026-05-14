import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  detectTrigger,
  formatBytes,
  isMentionMatch,
  isSlashMatch,
  type MentionItem,
  type PromptComposerProps,
  type SlashCommand,
} from './variants';

export function PromptComposer(props: PromptComposerProps) {
  const {
    value: valueProp,
    onChange,
    placeholder = '输入消息，Shift+Enter 换行...',
    disabled = false,
    loading = false,
    maxLength,
    maxRows = 8,
    submitKey = 'enter',
    attachments = [],
    slashCommands = [],
    mentions = [],
    onSubmit,
    onStop,
    onAttachAdd,
    onAttachRemove,
    onMention,
    onSlash,
    toolbar,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localValue, setLocalValue] = useState(valueProp ?? '');
  const [caret, setCaret] = useState(0);
  const [popupIndex, setPopupIndex] = useState(0);

  useEffect(() => {
    if (valueProp !== undefined && valueProp !== localValue) setLocalValue(valueProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = maxRows * 22 + 16;
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
  }, [localValue, maxRows]);

  const trigger = useMemo(() => detectTrigger(localValue, caret), [localValue, caret]);

  const filteredSlash = useMemo(() => {
    if (!trigger || trigger.trigger !== '/') return [] as SlashCommand[];
    return slashCommands.filter((c) => isSlashMatch(c, trigger.query));
  }, [trigger, slashCommands]);

  const filteredMentions = useMemo(() => {
    if (!trigger || trigger.trigger !== '@') return [] as MentionItem[];
    return mentions.filter((m) => isMentionMatch(m, trigger.query));
  }, [trigger, mentions]);

  const popupOpen = filteredSlash.length > 0 || filteredMentions.length > 0;
  const popupItems: (SlashCommand | MentionItem)[] = filteredSlash.length > 0 ? filteredSlash : filteredMentions;

  function pushValue(v: string) {
    setLocalValue(v);
    onChange?.(v);
  }

  function applyChoice(replacement: string, dropLen: number) {
    const before = localValue.slice(0, caret - dropLen);
    const after = localValue.slice(caret);
    const next = before + replacement + after;
    pushValue(next);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      const pos = (before + replacement).length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
      setCaret(pos);
    });
  }

  function chooseSlash(cmd: SlashCommand) {
    if (!trigger || trigger.trigger !== '/') return;
    applyChoice('/' + cmd.id + ' ', trigger.query.length + 1);
    onSlash?.(cmd);
  }

  function chooseMention(m: MentionItem) {
    if (!trigger || trigger.trigger !== '@') return;
    applyChoice('@' + m.label + ' ', trigger.query.length + 1);
    onMention?.(m);
  }

  function doSubmit() {
    if (disabled || loading) return;
    const text = localValue.trim();
    if (!text && attachments.length === 0) return;
    onSubmit?.(localValue);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (popupOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPopupIndex((i) => (i + 1) % popupItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPopupIndex((i) => (i - 1 + popupItems.length) % popupItems.length);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setCaret(-1);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const pick = popupItems[popupIndex];
        if (filteredSlash.length > 0) chooseSlash(pick as SlashCommand);
        else chooseMention(pick as MentionItem);
        return;
      }
    }

    const isMod = e.ctrlKey || e.metaKey;
    if (e.key === 'Enter') {
      const wantsMod = submitKey === 'mod-enter';
      const submit = (wantsMod && isMod) || (!wantsMod && !e.shiftKey && !isMod);
      if (submit) {
        e.preventDefault();
        doSubmit();
      }
    }
  }

  function onInput(e: ChangeEvent<HTMLTextAreaElement>) {
    pushValue(e.target.value);
    setCaret(e.target.selectionStart ?? e.target.value.length);
    setPopupIndex(0);
  }

  function onSelect() {
    const ta = textareaRef.current;
    if (!ta) return;
    setCaret(ta.selectionStart ?? caret);
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) onAttachAdd?.(f);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const submitHint = submitKey === 'mod-enter' ? '⌘/Ctrl + Enter 发送' : 'Enter 发送 · Shift+Enter 换行';

  return (
    <div
      className={[
        'cf-prompt',
        loading ? 'is-loading' : '',
        disabled ? 'is-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {attachments.length > 0 && (
        <div className="cf-prompt__attachments">
          {attachments.map((att) => (
            <span key={att.id} className="cf-prompt__attachment">
              {att.thumbnailUrl && <img src={att.thumbnailUrl} alt="" className="cf-prompt__attachment-thumb" />}
              <span className="cf-prompt__attachment-info">
                <span className="cf-prompt__attachment-name">{att.name}</span>
                {att.size && <span className="cf-prompt__attachment-size">{formatBytes(att.size)}</span>}
              </span>
              <button
                type="button"
                className="cf-prompt__attachment-remove"
                aria-label="移除"
                onClick={() => onAttachRemove?.(att.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="cf-prompt__editor">
        <textarea
          ref={textareaRef}
          value={localValue}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
          className="cf-prompt__textarea"
          onChange={onInput}
          onKeyDown={onKeyDown}
          onSelect={onSelect}
          onClick={onSelect}
          onFocus={onSelect}
        />
        {popupOpen && (
          <div className="cf-prompt__popup" role="listbox">
            {popupItems.map((item, i) => {
              const isSlash = filteredSlash.length > 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={i === popupIndex}
                  className={['cf-prompt__popup-item', i === popupIndex ? 'is-active' : '']
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => setPopupIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (isSlash) chooseSlash(item as SlashCommand);
                    else chooseMention(item as MentionItem);
                  }}
                >
                  <span className="cf-prompt__popup-label">
                    <span className="cf-prompt__popup-trigger">{isSlash ? '/' : '@'}</span>
                    {item.label}
                  </span>
                  {(item as { description?: string }).description && (
                    <span className="cf-prompt__popup-desc">{(item as { description?: string }).description}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="cf-prompt__toolbar">
        <div className="cf-prompt__toolbar-left">
          {toolbar ?? (
            <>
              <button
                type="button"
                className="cf-prompt__icon-btn"
                aria-label="附件"
                disabled={disabled || loading}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <path d="M11 4l-5 5a2 2 0 102.8 2.8l5-5a3 3 0 10-4.2-4.2L4.6 7.6" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <input ref={fileInputRef} type="file" multiple className="cf-prompt__file-input" onChange={onFiles} />
            </>
          )}
        </div>
        <div className="cf-prompt__toolbar-right">
          <span className="cf-prompt__hint">{submitHint}</span>
          {loading ? (
            <button type="button" className="cf-prompt__send is-stop" aria-label="停止" onClick={() => onStop?.()}>
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <rect x={4} y={4} width={8} height={8} fill="currentColor" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="cf-prompt__send"
              aria-label="发送"
              disabled={disabled}
              onClick={doSubmit}
            >
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path d="M2 14l12-6L2 2l2 5 6 1-6 1z" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
