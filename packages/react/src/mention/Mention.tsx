import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  applyMention,
  filterOptions,
  findTrigger,
  mentionClass,
  type MentionOption,
  type MentionProps,
  type TriggerMatch,
} from './variants';

export function Mention(props: MentionProps) {
  const {
    value,
    defaultValue = '',
    options,
    trigger = '@',
    placeholder = '输入 @ 触发提及',
    size = 'md',
    rows = 4,
    disabled = false,
    readonly = false,
    className,
    onChange,
    onSelect,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const text = isControlled ? (value as string) : internal;

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [match, setMatch] = useState<TriggerMatch | null>(null);
  const [active, setActive] = useState(0);
  const [pendingCaret, setPendingCaret] = useState<number | null>(null);

  const matches = match ? filterOptions(options, match.query) : [];
  const open = match !== null && matches.length > 0;

  useEffect(() => {
    if (pendingCaret == null || !ta.current) return;
    ta.current.focus();
    ta.current.setSelectionRange(pendingCaret, pendingCaret);
    setPendingCaret(null);
  }, [pendingCaret]);

  function setText(next: string) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function recompute() {
    if (!ta.current) return;
    const caret = ta.current.selectionStart ?? 0;
    setMatch(findTrigger(text, caret, trigger));
    setActive(0);
  }

  function onInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    queueMicrotask(() => {
      if (!ta.current) return;
      const caret = ta.current.selectionStart ?? 0;
      setMatch(findTrigger(e.target.value, caret, trigger));
      setActive(0);
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === 'Escape') {
      setMatch(null);
    }
  }

  function pick(opt: MentionOption | undefined) {
    if (!opt || opt.disabled || !match || !ta.current) return;
    const caret = ta.current.selectionStart ?? 0;
    const { text: nextText, caret: nextCaret } = applyMention(text, match, caret, trigger, opt);
    setText(nextText);
    onSelect?.(opt);
    setMatch(null);
    setPendingCaret(nextCaret);
  }

  const cls = mentionClass({ size, disabled, readonly, className });

  return (
    <div className={cls}>
      <textarea
        ref={ta}
        className="cf-mention__input"
        value={text}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        onChange={onInput}
        onKeyDown={onKeyDown}
        onClick={recompute}
        onKeyUp={recompute}
      />
      {open ? (
        <div className="cf-mention__menu" role="listbox">
          {matches.map((opt, i) => {
            const itemCls = [
              'cf-mention__item',
              i === active && 'is-active',
              opt.disabled && 'is-disabled',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={opt.value}
                type="button"
                className={itemCls}
                disabled={opt.disabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(opt);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className="cf-mention__label">{opt.label ?? opt.value}</span>
                {opt.description ? (
                  <span className="cf-mention__desc">{opt.description}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
