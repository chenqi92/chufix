import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  applyVariableSuggestion,
  filterVariableOptions,
  findVariableSuggestion,
  findVariableTokenAt,
  normalizeVariables,
  parseTokens,
  variableMap,
  type VariableAwareInputProps,
  type VariableToken,
} from './variants';

export function VariableAwareInput(props: VariableAwareInputProps) {
  const {
    value,
    onChange,
    variables,
    size = 'md',
    variant = 'outline',
    placeholder = '',
    disabled = false,
    error = false,
    className,
    suggest = true,
    suggestTrigger = '{{',
    interactive = true,
    showVariablePopover = true,
    onVariableSelect,
    onVariableClick,
    onVariableUpdate,
    onVariableCreate,
    renderVariableOption,
    renderVariablePopover,
  } = props;

  const variableOptions = useMemo(() => normalizeVariables(variables ?? []), [variables]);
  const variablesByName = useMemo(() => variableMap(variableOptions), [variableOptions]);
  const tokens = useMemo(() => parseTokens(value, variablesByName), [value, variablesByName]);
  const [suggestion, setSuggestion] = useState<ReturnType<typeof findVariableSuggestion>>(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [activeToken, setActiveToken] = useState<VariableToken | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [pendingCaret, setPendingCaret] = useState<number | null>(null);
  const menuId = useMemo(() => `cf-vinput-menu-${Math.random().toString(36).slice(2)}`, []);
  const popoverId = useMemo(() => `cf-vinput-popover-${Math.random().toString(36).slice(2)}`, []);
  const suggestionOptions = useMemo(
    () => (suggestion ? filterVariableOptions(variableOptions, suggestion.query) : []),
    [suggestion, variableOptions],
  );
  const suggestionsOpen = Boolean(suggest && suggestion && suggestionOptions.length);
  const activeVariable = activeToken
    ? activeToken.variable ?? variablesByName.get(activeToken.name)
    : undefined;
  const popoverOpen = Boolean(interactive && showVariablePopover && activeToken && !suggestionsOpen);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pendingCaret == null || !inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(pendingCaret, pendingCaret);
    setPendingCaret(null);
  }, [pendingCaret]);

  const cls = [
    'cf-vinput',
    `cf-vinput--${size}`,
    `cf-vinput--${variant}`,
    disabled && 'is-disabled',
    error && 'is-error',
    (suggestionsOpen || popoverOpen) && 'is-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const onScroll = () => {
    if (overlayRef.current && inputRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const closePanels = () => {
    setSuggestion(null);
    setActiveToken(null);
  };

  const syncSuggestion = (nextValue = value, caret = inputRef.current?.selectionStart ?? 0) => {
    if (!suggest || disabled) {
      setSuggestion(null);
      return;
    }
    const next = findVariableSuggestion(nextValue, caret, suggestTrigger);
    setSuggestion(next);
    setActiveSuggestion(0);
    if (next) setActiveToken(null);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    syncSuggestion(e.target.value, e.target.selectionStart ?? e.target.value.length);
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) return;
    syncSuggestion();
  };

  const pickVariable = (option = suggestionOptions[activeSuggestion]) => {
    if (!option || option.disabled || !suggestion) return;
    const next = applyVariableSuggestion(value, suggestion, option);
    onChange(next.text);
    onVariableSelect?.(option);
    setSuggestion(null);
    setPendingCaret(next.caret);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestionsOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion((index) => (index + 1) % suggestionOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion((index) => (index - 1 + suggestionOptions.length) % suggestionOptions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        pickVariable();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSuggestion(null);
      }
      return;
    }
    if (e.key === 'Escape') closePanels();
  };

  const openVariablePopover = (e: MouseEvent<HTMLInputElement>) => {
    if (!interactive) return;
    const input = e.currentTarget;
    const caret = input.selectionStart ?? 0;
    const token = findVariableTokenAt(tokens, caret);
    if (!token) {
      setActiveToken(null);
      syncSuggestion(value, caret);
      return;
    }
    const variable = token.variable ?? variablesByName.get(token.name);
    setActiveToken(token);
    setDraftValue(variable?.value ?? '');
    setSuggestion(null);
    onVariableClick?.({ name: token.name, token, variable });
  };

  const updateVariable = () => {
    if (!activeToken) return;
    onVariableUpdate?.({
      name: activeToken.name,
      value: draftValue,
      token: activeToken,
      variable: activeVariable,
    });
  };

  const createVariable = () => {
    if (!activeToken) return;
    onVariableCreate?.({
      name: activeToken.name,
      token: activeToken,
      variable: activeVariable,
    });
  };

  const onRootBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget instanceof Node && rootRef.current?.contains(e.relatedTarget)) return;
    closePanels();
  };

  return (
    <div ref={rootRef} className={cls} onBlur={onRootBlur}>
      <div ref={overlayRef} className="cf-vinput__overlay" aria-hidden="true">
        {!value && placeholder ? (
          <span className="cf-vinput__placeholder">{placeholder}</span>
        ) : (
          tokens.map((tok, i) =>
            tok.type === 'text' ? (
              <span key={i} className="cf-vinput__plain">
                {tok.text}
              </span>
            ) : (
              <span
                key={i}
                className={[
                  'cf-vinput__var',
                  !tok.valid && 'is-invalid',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {tok.raw}
              </span>
            ),
          )
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="cf-vinput__input"
        value={value}
        disabled={disabled}
        aria-expanded={suggestionsOpen || popoverOpen}
        aria-controls={suggestionsOpen ? menuId : popoverOpen ? popoverId : undefined}
        spellCheck={false}
        autoComplete="off"
        onChange={onInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onClick={openVariablePopover}
        onScroll={onScroll}
      />
      {suggestionsOpen ? (
        <div id={menuId} className="cf-vinput__menu" role="listbox">
          {suggestionOptions.map((opt, i) => {
            const active = i === activeSuggestion;
            const optionCls = [
              'cf-vinput__option',
              active && 'is-active',
              opt.disabled && 'is-disabled',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={opt.name}
                type="button"
                role="option"
                aria-selected={active}
                disabled={opt.disabled}
                className={optionCls}
                onMouseDown={(event) => {
                  event.preventDefault();
                  pickVariable(opt);
                }}
                onMouseEnter={() => setActiveSuggestion(i)}
              >
                {renderVariableOption ? renderVariableOption({
                  variable: opt,
                  active,
                  query: suggestion?.query ?? '',
                }) : (
                  <>
                    <span className="cf-vinput__option-main">
                      <span className="cf-vinput__option-name">{opt.label}</span>
                      {opt.scope ? <span className="cf-vinput__option-scope">{opt.scope}</span> : null}
                    </span>
                    {opt.value ? <span className="cf-vinput__option-value">{opt.value}</span> : null}
                    {opt.description ? <span className="cf-vinput__option-desc">{opt.description}</span> : null}
                  </>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
      {popoverOpen && activeToken ? (
        <div id={popoverId} className="cf-vinput__popover" role="dialog" tabIndex={-1}>
          {renderVariablePopover ? renderVariablePopover({
            variable: activeVariable,
            token: activeToken,
            draftValue,
            setDraftValue,
            update: updateVariable,
            create: createVariable,
            close: closePanels,
          }) : (
            <>
              <div className="cf-vinput__popover-head">
                <span className="cf-vinput__popover-title">{activeVariable?.label ?? activeToken.name}</span>
                {activeVariable?.scope ? (
                  <span className="cf-vinput__badge">{activeVariable.scope}</span>
                ) : (
                  <span className="cf-vinput__badge is-danger">未定义</span>
                )}
              </div>
              {activeVariable?.description ? (
                <p className="cf-vinput__popover-desc">{activeVariable.description}</p>
              ) : null}
              <dl className="cf-vinput__meta">
                <div>
                  <dt>变量名</dt>
                  <dd>{activeToken.name}</dd>
                </div>
                {activeVariable?.value ? (
                  <div>
                    <dt>当前值</dt>
                    <dd>{activeVariable.value}</dd>
                  </div>
                ) : null}
              </dl>
              {activeVariable?.editable ? (
                <label className="cf-vinput__edit">
                  <span>修改值</span>
                  <input
                    className="cf-vinput__edit-input"
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        updateVariable();
                      }
                    }}
                  />
                </label>
              ) : null}
              <div className="cf-vinput__actions">
                {activeVariable?.editable ? (
                  <button type="button" className="cf-vinput__action is-primary" onClick={updateVariable}>
                    更新变量
                  </button>
                ) : null}
                {!activeVariable ? (
                  <button type="button" className="cf-vinput__action is-primary" onClick={createVariable}>
                    创建变量
                  </button>
                ) : null}
                <button type="button" className="cf-vinput__action" onClick={closePanels}>
                  关闭
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
