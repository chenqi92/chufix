import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import {
  flattenTree,
  getCheckState,
  indexTree,
  toggleCascade,
  treeSelectClass,
  type FlatTreeSelectNode,
  type TreeSelectNode,
  type TreeSelectProps,
} from './variants';

export function TreeSelect({
  value,
  options,
  placeholder = '请选择',
  multiple = false,
  cascade = true,
  searchable = false,
  clearable = false,
  disabled = false,
  size = 'md',
  defaultExpandedKeys,
  showLines = true,
  className,
  onChange,
  onExpand,
  onCollapse,
}: TreeSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const index = useMemo(() => indexTree(options), [options]);
  const flat = useMemo(() => flattenTree(options, index), [options, index]);

  const initialExpanded = useMemo<Set<string>>(() => {
    if (defaultExpandedKeys === 'all') {
      return new Set(flat.filter((n) => n.isBranch).map((n) => n.value));
    }
    return new Set(defaultExpandedKeys ?? []);
  }, [defaultExpandedKeys, flat]);
  const [expandedSet, setExpandedSet] = useState<Set<string>>(initialExpanded);

  useEffect(() => {
    setExpandedSet(initialExpanded);
  }, [initialExpanded]);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedNodes = selectedValues
    .map((v) => index.get(v))
    .filter((n): n is FlatTreeSelectNode => Boolean(n));

  const label = selectedNodes.length
    ? multiple
      ? selectedNodes.map((n) => n.label).join(' / ')
      : selectedNodes[0].label
    : placeholder;

  const visibleRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword) {
      const matchedSelf = new Set<string>();
      for (const node of flat) {
        if (`${node.label} ${node.path.join(' ')}`.toLowerCase().includes(keyword)) {
          matchedSelf.add(node.value);
        }
      }
      const includeSet = new Set(matchedSelf);
      for (const v of matchedSelf) {
        let cur = index.get(v)?.parent;
        while (cur) {
          includeSet.add(cur);
          cur = index.get(cur)?.parent;
        }
      }
      return flat.filter((n) => includeSet.has(n.value));
    }
    return flat.filter((n) => {
      let cur = n.parent;
      while (cur) {
        if (!expandedSet.has(cur)) return false;
        cur = index.get(cur)?.parent ?? null;
      }
      return true;
    });
  }, [flat, expandedSet, query, index]);

  useEffect(() => {
    if (!open) return;
    const handler = (ev: PointerEvent) => {
      if (rootRef.current && rootRef.current.contains(ev.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  function toggleExpand(node: FlatTreeSelectNode, ev: MouseEvent) {
    ev.stopPropagation();
    if (!node.isBranch) return;
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(node.value)) {
        next.delete(node.value);
        onCollapse?.(node.value);
      } else {
        next.add(node.value);
        onExpand?.(node.value);
      }
      return next;
    });
  }

  function deepFind(node: TreeSelectNode, target: string): TreeSelectNode | null {
    if (node.value === target) return node;
    for (const c of node.children ?? []) {
      const r = deepFind(c, target);
      if (r) return r;
    }
    return null;
  }

  function commit(node: FlatTreeSelectNode) {
    if (disabled || node.disabled) return;

    if (multiple) {
      let nextSet: Set<string>;
      if (cascade && node.isBranch) {
        nextSet = toggleCascade(node, index, selectedSet);
      } else {
        nextSet = new Set(selectedSet);
        if (nextSet.has(node.value)) nextSet.delete(node.value);
        else nextSet.add(node.value);
      }
      const raw = options.map((o) => deepFind(o, node.value)).find(Boolean) ?? undefined;
      onChange?.([...nextSet], raw ?? undefined);
      return;
    }

    if (node.isBranch) {
      setExpandedSet((prev) => {
        const next = new Set(prev);
        if (next.has(node.value)) next.delete(node.value);
        else next.add(node.value);
        return next;
      });
      return;
    }
    const raw = options.map((o) => deepFind(o, node.value)).find(Boolean) ?? undefined;
    onChange?.(node.value, raw ?? undefined);
    setOpen(false);
  }

  function clearSelection(event: MouseEvent) {
    event.stopPropagation();
    onChange?.(multiple ? [] : undefined);
  }

  const cls = [treeSelectClass({ size, open, disabled }), className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={cls}>
      <button
        type="button"
        className="cf-treeselect__trigger"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup={multiple ? 'tree' : 'listbox'}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`cf-treeselect__value${selectedNodes.length ? '' : ' is-placeholder'}`}
        >
          {label}
        </span>
        {clearable && selectedNodes.length ? (
          <span
            className="cf-treeselect__clear"
            role="button"
            aria-label="清除"
            onClick={clearSelection}
          >
            ×
          </span>
        ) : null}
        <svg
          className="cf-treeselect__chevron"
          viewBox="0 0 16 16"
          width={14}
          height={14}
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          className={`cf-treeselect__popup${showLines ? ' has-lines' : ''}`}
          role={multiple ? 'tree' : 'listbox'}
        >
          {searchable ? (
            <input
              className="cf-treeselect__search"
              type="search"
              placeholder="搜索节点..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
          <div className="cf-treeselect__list">
            {visibleRows.map((node) => {
              const checkState = getCheckState(node, selectedSet);
              return (
                <div
                  key={node.value}
                  className={[
                    'cf-treeselect__row',
                    selectedSet.has(node.value) && 'is-selected',
                    node.disabled && 'is-disabled',
                    expandedSet.has(node.value) && 'is-expanded',
                    node.isBranch ? 'is-branch' : 'is-leaf',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ '--cf-tree-depth': node.depth } as CSSProperties}
                  role={multiple ? 'treeitem' : 'option'}
                  aria-selected={selectedSet.has(node.value)}
                  aria-level={node.depth + 1}
                  aria-expanded={node.isBranch ? expandedSet.has(node.value) : undefined}
                >
                  {Array.from({ length: node.depth }, (_, d) => (
                    <span key={`g${d}`} className="cf-treeselect__indent" aria-hidden="true" />
                  ))}
                  <button
                    type="button"
                    className={`cf-treeselect__expand${node.isBranch ? '' : ' is-placeholder'}`}
                    tabIndex={-1}
                    aria-label={
                      node.isBranch
                        ? expandedSet.has(node.value)
                          ? '折叠'
                          : '展开'
                        : undefined
                    }
                    onClick={(e) => node.isBranch && toggleExpand(node, e)}
                  >
                    {node.isBranch ? (
                      <svg
                        className={`cf-treeselect__expand-icon${expandedSet.has(node.value) ? ' is-open' : ''}`}
                        viewBox="0 0 16 16"
                        width={10}
                        height={10}
                        aria-hidden="true"
                      >
                        <path
                          d="M5 3l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className="cf-treeselect__row-btn"
                    disabled={node.disabled}
                    onClick={() => commit(node)}
                  >
                    {multiple ? (
                      <span
                        className={`cf-treeselect__checkbox is-${checkState}`}
                        aria-hidden="true"
                      >
                        {checkState === 'checked' ? (
                          <svg viewBox="0 0 16 16" width={10} height={10}>
                            <path
                              d="M3 8l3 3 7-7"
                              stroke="currentColor"
                              strokeWidth={2}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : checkState === 'indeterminate' ? (
                          <span className="cf-treeselect__indeterminate-bar" />
                        ) : null}
                      </span>
                    ) : null}
                    <span className="cf-treeselect__label">{node.label}</span>
                    {!multiple && selectedSet.has(node.value) ? (
                      <span className="cf-treeselect__check" aria-hidden="true">
                        ✓
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
            {!visibleRows.length ? (
              <div className="cf-treeselect__empty">没有匹配节点</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
