import { Fragment, useMemo, useRef } from 'react';
import {
  parseTokens,
  type VariableAwareInputProps,
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
  } = props;

  const knownSet = useMemo(() => new Set(variables ?? []), [variables]);
  const tokens = useMemo(() => parseTokens(value, knownSet), [value, knownSet]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const cls = [
    'cf-vinput',
    `cf-vinput--${size}`,
    `cf-vinput--${variant}`,
    disabled && 'is-disabled',
    error && 'is-error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const onScroll = () => {
    if (overlayRef.current && inputRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  return (
    <div className={cls}>
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
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
      />
    </div>
  );
}
