import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import {
  descendantKeys,
  findParents,
  isAllDescendantsChecked,
  treeViewClass,
  type TreeNode,
  type TreeViewProps,
} from './variants';

interface RowHelpers {
  expandedSet: Set<string>;
  selectedKey: string | null;
  checkable: boolean;
  isFullyChecked: (n: TreeNode) => boolean;
  isPartiallyChecked: (n: TreeNode) => boolean;
  onToggle: (n: TreeNode) => void;
  onSelect: (n: TreeNode) => void;
  onCheck: (n: TreeNode) => void;
}

function Caret({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick: (e: MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      className={`cf-tree__caret${expanded ? ' is-open' : ''}`}
      aria-label={expanded ? '折叠' : '展开'}
      onClick={onClick}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M5 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Checkbox({
  checked,
  indeterminate,
  disabled,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="cf-tree__checkbox"
      checked={checked}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(_e: ChangeEvent<HTMLInputElement>) => onChange()}
    />
  );
}

function TreeNodeRow({
  node,
  depth,
  helpers,
}: {
  node: TreeNode;
  depth: number;
  helpers: RowHelpers;
}) {
  const hasChildren = !!node.children?.length;
  const isExpanded = helpers.expandedSet.has(node.key);
  const isSelected = helpers.selectedKey === node.key;
  const isChecked = helpers.isFullyChecked(node);
  const isIndeterminate = helpers.isPartiallyChecked(node);

  function handleRowClick() {
    if (hasChildren && !helpers.checkable) helpers.onToggle(node);
    helpers.onSelect(node);
  }

  function handleCaretClick(e: MouseEvent) {
    e.stopPropagation();
    helpers.onToggle(node);
  }

  const rowCls = [
    'cf-tree__row',
    isSelected && 'is-selected',
    node.disabled && 'is-disabled',
  ].filter(Boolean).join(' ');

  return (
    <li className="cf-tree__item" role="none">
      <div
        className={rowCls}
        style={{ paddingInlineStart: `${depth * 16 + 4}px` }}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        onClick={handleRowClick}
      >
        {hasChildren ? (
          <Caret expanded={isExpanded} onClick={handleCaretClick} />
        ) : (
          <span className="cf-tree__caret cf-tree__caret--leaf" aria-hidden="true" />
        )}

        {helpers.checkable ? (
          <Checkbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            disabled={node.disabled}
            onChange={() => helpers.onCheck(node)}
          />
        ) : null}

        {node.icon ? <span className="cf-tree__icon">{node.icon}</span> : null}
        <span className="cf-tree__label">{node.label}</span>
      </div>

      {hasChildren && isExpanded ? (
        <ul className="cf-tree__list cf-tree__list--child">
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.key}
              node={child}
              depth={depth + 1}
              helpers={helpers}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TreeView(props: TreeViewProps) {
  const {
    nodes,
    value,
    defaultValue = [],
    expandedKeys,
    defaultExpandedKeys = [],
    checkable = false,
    cascade = true,
    selectedKey,
    size = 'md',
    showLine = true,
    emptyText = '暂无数据',
    className,
    onChange,
    onExpandedKeysChange,
    onSelectedKeyChange,
    onSelect,
    onExpand,
    onCheck,
  } = props;

  const isControlled = value !== undefined;
  const [internalChecked, setInternalChecked] = useState<string[]>(defaultValue);
  const checked = isControlled ? (value as string[]) : internalChecked;
  const checkedSet = new Set(checked);

  const isExpControlled = expandedKeys !== undefined;
  const [internalExp, setInternalExp] = useState<string[]>(defaultExpandedKeys);
  const expanded = isExpControlled ? (expandedKeys as string[]) : internalExp;
  const expandedSet = new Set(expanded);

  function isFullyChecked(node: TreeNode): boolean {
    if (!node.children?.length) return checkedSet.has(node.key);
    return node.children.every(isFullyChecked);
  }
  function isPartiallyChecked(node: TreeNode): boolean {
    if (!node.children?.length) return false;
    let some = false;
    let all = true;
    for (const c of node.children) {
      const f = isFullyChecked(c);
      const p = isPartiallyChecked(c);
      if (f || p) some = true;
      if (!f) all = false;
    }
    return some && !all;
  }

  function toggleExpand(node: TreeNode) {
    const set = new Set(expandedSet);
    const wasOpen = set.has(node.key);
    if (wasOpen) set.delete(node.key);
    else set.add(node.key);
    const arr = Array.from(set);
    if (!isExpControlled) setInternalExp(arr);
    onExpandedKeysChange?.(arr);
    onExpand?.(node, !wasOpen);
  }

  function toggleCheck(node: TreeNode) {
    if (node.disabled) return;
    const set = new Set(checkedSet);
    const next = !isFullyChecked(node);

    if (cascade) {
      const targets = [node.key, ...descendantKeys(node)];
      for (const k of targets) {
        if (next) set.add(k);
        else set.delete(k);
      }
      const parents = findParents(nodes, node.key);
      for (let i = parents.length - 1; i >= 0; i--) {
        const p = parents[i];
        const allOn = p.children!.every((c) => isAllDescendantsChecked(c, set));
        if (allOn) set.add(p.key);
        else set.delete(p.key);
      }
    } else {
      if (next) set.add(node.key);
      else set.delete(node.key);
    }

    const arr = Array.from(set);
    if (!isControlled) setInternalChecked(arr);
    onChange?.(arr);
    onCheck?.(node, next);
  }

  function selectNode(node: TreeNode) {
    if (node.disabled || node.selectable === false) return;
    onSelectedKeyChange?.(node.key);
    onSelect?.(node);
  }

  const helpers: RowHelpers = {
    expandedSet,
    selectedKey: selectedKey ?? null,
    checkable,
    isFullyChecked,
    isPartiallyChecked,
    onToggle: toggleExpand,
    onSelect: selectNode,
    onCheck: toggleCheck,
  };

  if (!nodes.length) {
    return (
      <div className={treeViewClass({ size, showLine, checkable, className })} role="tree">
        <div className="cf-tree__empty">{emptyText}</div>
      </div>
    );
  }

  return (
    <div className={treeViewClass({ size, showLine, checkable, className })} role="tree">
      <ul className="cf-tree__list">
        {nodes.map((node) => (
          <TreeNodeRow key={node.key} node={node} depth={0} helpers={helpers} />
        ))}
      </ul>
    </div>
  );
}
