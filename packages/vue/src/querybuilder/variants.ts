export type QueryFieldType = 'string' | 'number' | 'date' | 'boolean' | 'enum';

export type QueryOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'isnull'
  | 'notnull';

export interface QueryFieldOption {
  value: string | number;
  label: string;
}

export interface QueryField {
  key: string;
  label: string;
  type: QueryFieldType;
  options?: QueryFieldOption[];
}

export interface QueryCondition {
  id: string;
  field: string;
  operator: QueryOperator;
  value?: unknown;
}

export interface QueryGroup {
  combinator: 'AND' | 'OR';
  conditions: QueryCondition[];
}

export function operatorsFor(type: QueryFieldType): { value: QueryOperator; label: string }[] {
  const common = [
    { value: 'isnull' as QueryOperator, label: '为空' },
    { value: 'notnull' as QueryOperator, label: '不为空' },
  ];
  switch (type) {
    case 'string':
      return [
        { value: 'eq', label: '等于' },
        { value: 'neq', label: '不等于' },
        { value: 'contains', label: '包含' },
        { value: 'startsWith', label: '开头是' },
        { value: 'endsWith', label: '结尾是' },
        ...common,
      ];
    case 'number':
    case 'date':
      return [
        { value: 'eq', label: '=' },
        { value: 'neq', label: '≠' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '≥' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '≤' },
        ...common,
      ];
    case 'boolean':
      return [
        { value: 'eq', label: '是' },
        ...common,
      ];
    case 'enum':
      return [
        { value: 'eq', label: '是' },
        { value: 'neq', label: '不是' },
        { value: 'in', label: '属于' },
        ...common,
      ];
  }
}

export function defaultOperatorFor(type: QueryFieldType): QueryOperator {
  return operatorsFor(type)[0]?.value ?? 'eq';
}

export function newConditionId(): string {
  return `c-${Math.random().toString(36).slice(2, 9)}`;
}

export function needsValue(op: QueryOperator): boolean {
  return op !== 'isnull' && op !== 'notnull';
}
