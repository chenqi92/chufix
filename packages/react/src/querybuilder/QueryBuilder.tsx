import { useMemo } from 'react';
import {
  type QueryCondition,
  type QueryField,
  type QueryGroup,
  type QueryOperator,
  defaultOperatorFor,
  needsValue,
  newConditionId,
  operatorsFor,
} from './variants';

export interface QueryBuilderProps {
  fields: QueryField[];
  value: QueryGroup;
  onChange?: (value: QueryGroup) => void;
  className?: string;
}

export function QueryBuilder({ fields, value, onChange, className }: QueryBuilderProps) {
  const fieldByKey = useMemo(() => {
    const m = new Map<string, QueryField>();
    for (const f of fields) m.set(f.key, f);
    return m;
  }, [fields]);

  function update(next: QueryGroup) {
    onChange?.(next);
  }
  function setCombinator(c: 'AND' | 'OR') {
    update({ ...value, combinator: c });
  }
  function addCondition() {
    const first = fields[0];
    if (!first) return;
    const cond: QueryCondition = {
      id: newConditionId(),
      field: first.key,
      operator: defaultOperatorFor(first.type),
      value: first.type === 'boolean' ? true : '',
    };
    update({ ...value, conditions: [...value.conditions, cond] });
  }
  function removeCondition(id: string) {
    update({ ...value, conditions: value.conditions.filter((c) => c.id !== id) });
  }
  function patch(id: string, p: Partial<QueryCondition>) {
    update({
      ...value,
      conditions: value.conditions.map((c) => (c.id === id ? { ...c, ...p } : c)),
    });
  }
  function fieldOf(c: QueryCondition): QueryField | undefined {
    return fieldByKey.get(c.field);
  }
  function onFieldChange(id: string, key: string) {
    const f = fieldByKey.get(key);
    if (!f) return;
    patch(id, {
      field: key,
      operator: defaultOperatorFor(f.type),
      value: f.type === 'boolean' ? true : '',
    });
  }
  function onOperatorChange(id: string, op: QueryOperator) {
    patch(id, { operator: op, value: needsValue(op) ? '' : undefined });
  }

  return (
    <div className={['cf-qb', className].filter(Boolean).join(' ')}>
      <div className="cf-qb__combinator">
        <button
          type="button"
          className={['cf-qb__chip', value.combinator === 'AND' && 'is-active'].filter(Boolean).join(' ')}
          onClick={() => setCombinator('AND')}
        >AND</button>
        <button
          type="button"
          className={['cf-qb__chip', value.combinator === 'OR' && 'is-active'].filter(Boolean).join(' ')}
          onClick={() => setCombinator('OR')}
        >OR</button>
        <span className="cf-qb__count">{value.conditions.length} 个条件</span>
      </div>
      <ul className="cf-qb__list">
        {value.conditions.map((c) => {
          const f = fieldOf(c);
          return (
            <li key={c.id} className="cf-qb__row">
              <select
                className="cf-qb__select"
                value={c.field}
                onChange={(e) => onFieldChange(c.id, e.target.value)}
              >
                {fields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>
              <select
                className="cf-qb__select cf-qb__select--op"
                value={c.operator}
                onChange={(e) => onOperatorChange(c.id, e.target.value as QueryOperator)}
              >
                {operatorsFor(f?.type ?? 'string').map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              {needsValue(c.operator) && (
                f?.type === 'enum' ? (
                  <select
                    className="cf-qb__select"
                    value={String(c.value ?? '')}
                    onChange={(e) => patch(c.id, { value: e.target.value })}
                  >
                    {(f.options ?? []).map((opt) => (
                      <option key={String(opt.value)} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : f?.type === 'boolean' ? (
                  <select
                    className="cf-qb__select"
                    value={String(c.value)}
                    onChange={(e) => patch(c.id, { value: e.target.value === 'true' })}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    className="cf-qb__input"
                    type={f?.type === 'number' ? 'number' : f?.type === 'date' ? 'date' : 'text'}
                    value={(c.value as string | number | undefined) ?? ''}
                    onChange={(e) => patch(c.id, { value: e.target.value })}
                  />
                )
              )}
              <button
                type="button"
                className="cf-qb__remove"
                aria-label="remove condition"
                onClick={() => removeCondition(c.id)}
              >×</button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="cf-qb__add" onClick={addCondition}>
        + 添加条件
      </button>
    </div>
  );
}
