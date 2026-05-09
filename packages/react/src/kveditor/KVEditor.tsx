import { useEffect, useState } from 'react';
import { kvEditorClass, type KVEditorProps, type KVRow } from './variants';

export function KVEditor(props: KVEditorProps) {
  const {
    value,
    defaultValue = [],
    size = 'md',
    keyPlaceholder = '键',
    valuePlaceholder = '值',
    showToggle = false,
    showDescription = false,
    autoAppend = true,
    disabled = false,
    readonly = false,
    bordered = true,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<KVRow[]>(defaultValue);
  const rows = isControlled ? (value as KVRow[]) : internal;

  function ensureTrailing(list: KVRow[]): KVRow[] {
    if (!autoAppend || disabled || readonly) return list;
    const last = list[list.length - 1];
    if (!last || last.key.trim() || last.value.trim()) {
      return [...list, { key: '', value: '', enabled: true }];
    }
    return list;
  }

  function commit(next: KVRow[]) {
    const ensured = ensureTrailing(next);
    if (!isControlled) setInternal(ensured);
    onChange?.(ensured);
  }

  useEffect(() => {
    const ensured = ensureTrailing(rows);
    if (ensured !== rows) commit(ensured);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(i: number, patch: Partial<KVRow>) {
    commit(rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function removeAt(i: number) {
    commit(rows.filter((_, idx) => idx !== i));
  }

  const cls = kvEditorClass({ size, bordered, disabled, readonly, className });

  const headerClasses = [
    'cf-kv__header',
    showToggle && 'has-toggle',
    showDescription && 'has-desc',
  ]
    .filter(Boolean)
    .join(' ');
  const rowClasses = headerClasses.replace('cf-kv__header', 'cf-kv__row');

  return (
    <div className={cls}>
      <div className={headerClasses}>
        {showToggle ? <span className="cf-kv__col cf-kv__col--toggle" aria-hidden /> : null}
        <span className="cf-kv__col cf-kv__col--key">{keyPlaceholder}</span>
        <span className="cf-kv__col cf-kv__col--value">{valuePlaceholder}</span>
        {showDescription ? <span className="cf-kv__col cf-kv__col--desc">说明</span> : null}
        <span className="cf-kv__col cf-kv__col--remove" aria-hidden />
      </div>
      {rows.map((row, i) => (
        <div key={i} className={rowClasses}>
          {showToggle ? (
            <input
              type="checkbox"
              className="cf-kv__col cf-kv__col--toggle cf-kv__check"
              checked={row.enabled !== false}
              disabled={disabled || readonly}
              onChange={(e) => update(i, { enabled: e.target.checked })}
            />
          ) : null}
          <input
            type="text"
            className="cf-kv__col cf-kv__col--key cf-kv__input"
            value={row.key}
            placeholder={keyPlaceholder}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) => update(i, { key: e.target.value })}
          />
          <input
            type="text"
            className="cf-kv__col cf-kv__col--value cf-kv__input"
            value={row.value}
            placeholder={valuePlaceholder}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) => update(i, { value: e.target.value })}
          />
          {showDescription ? (
            <input
              type="text"
              className="cf-kv__col cf-kv__col--desc cf-kv__input"
              value={row.description ?? ''}
              placeholder="说明（可选）"
              disabled={disabled}
              readOnly={readonly}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          ) : null}
          {!disabled && !readonly ? (
            <button
              type="button"
              className="cf-kv__col cf-kv__col--remove cf-kv__remove"
              aria-label={`删除第 ${i + 1} 行`}
              onClick={() => removeAt(i)}
            >
              ×
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
