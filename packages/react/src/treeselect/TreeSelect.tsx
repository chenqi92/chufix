import { useMemo, useState, type CSSProperties, type MouseEvent } from 'react';
import {
  flattenTreeSelect,
  treeSelectClass,
  type TreeSelectNode,
  type TreeSelectProps,
} from './variants';

export function TreeSelect({
  value,
  options,
  placeholder = '请选择',
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  size = 'md',
  onChange,
  className,
  ...rest
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const flat = useMemo(() => flattenTreeSelect(options), [options]);
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedNodes = flat.filter((node) => selectedValues.includes(node.value));
  const label = selectedNodes.length
    ? multiple ? selectedNodes.map((node) => node.label).join(' / ') : selectedNodes[0].label
    : placeholder;
  const filtered = query.trim()
    ? flat.filter((node) => `${node.label} ${node.path.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
    : flat;

  function commit(node: TreeSelectNode) {
    if (disabled || node.disabled) return;
    let next: string | string[] | undefined;
    if (multiple) {
      const current = new Set(selectedValues);
      if (current.has(node.value)) current.delete(node.value);
      else current.add(node.value);
      next = [...current];
    } else {
      next = node.value;
      setOpen(false);
    }
    onChange?.(next, node);
  }

  function clear(event: MouseEvent) {
    event.stopPropagation();
    onChange?.(multiple ? [] : undefined);
  }

  return (
    <div className={treeSelectClass({ size, open, disabled, className })} {...rest}>
      <button
        type="button"
        className="cf-treeselect__trigger"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`cf-treeselect__value${selectedNodes.length ? '' : ' is-placeholder'}`}>{label}</span>
        {clearable && selectedNodes.length ? <span className="cf-treeselect__clear" aria-hidden="true" onClick={clear}>×</span> : null}
        <span className="cf-treeselect__chevron" aria-hidden="true">⌄</span>
      </button>

      {open ? (
        <div className="cf-treeselect__popup" role="listbox">
          {searchable ? (
            <input
              className="cf-treeselect__search"
              type="search"
              placeholder="搜索节点..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
          {filtered.map((node) => (
            <button
              key={node.value}
              type="button"
              className={[
                'cf-treeselect__option',
                selectedValues.includes(node.value) && 'is-selected',
                node.disabled && 'is-disabled',
              ].filter(Boolean).join(' ')}
              style={{ '--cf-tree-depth': node.depth } as CSSProperties}
              role="option"
              aria-selected={selectedValues.includes(node.value)}
              disabled={node.disabled}
              onClick={() => commit(node)}
            >
              <span className="cf-treeselect__branch" aria-hidden="true" />
              <span className="cf-treeselect__label">{node.label}</span>
              {selectedValues.includes(node.value) ? <span className="cf-treeselect__check">✓</span> : null}
            </button>
          ))}
          {!filtered.length ? <div className="cf-treeselect__empty">没有匹配节点</div> : null}
        </div>
      ) : null}
    </div>
  );
}
