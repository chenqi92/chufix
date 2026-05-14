export type TreeSelectSize = 'sm' | 'md' | 'lg';

export interface TreeSelectNode {
  value: string;
  label: string;
  disabled?: boolean;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  value?: string | string[];
  options: TreeSelectNode[];
  placeholder?: string;
  multiple?: boolean;
  /**
   * Multi mode only: clicking a parent toggles all enabled descendants.
   * Parent shows "indeterminate" when descendants partially selected.
   * Default: true.
   */
  cascade?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: TreeSelectSize;
  /**
   * Initial expanded node values. Pass `'all'` to expand everything.
   * Default: only root nodes visible (children collapsed).
   */
  defaultExpandedKeys?: string[] | 'all';
  /** Show indent guide lines connecting parent → children. Default true. */
  showLines?: boolean;
  className?: string;
  onChange?: (value: string | string[] | undefined, node?: TreeSelectNode) => void;
  onExpand?: (value: string) => void;
  onCollapse?: (value: string) => void;
}

export interface FlatTreeSelectNode {
  value: string;
  label: string;
  disabled?: boolean;
  depth: number;
  /** Names of ancestor + self, for path-aware search. */
  path: string[];
  /** Parent value, or null for root. */
  parent: string | null;
  /** Values of direct children (empty if leaf). */
  childValues: string[];
  /** All descendant values (recursive). */
  descendantValues: string[];
  /** Whether this is a branch node (has children). */
  isBranch: boolean;
}

/** Walk the tree and build a flat lookup index. */
export function indexTree(nodes: TreeSelectNode[]): Map<string, FlatTreeSelectNode> {
  const map = new Map<string, FlatTreeSelectNode>();
  function visit(node: TreeSelectNode, depth: number, parent: string | null, ancestorPath: string[]) {
    const path = [...ancestorPath, node.label];
    const childValues = node.children?.map((c) => c.value) ?? [];
    const flat: FlatTreeSelectNode = {
      value: node.value,
      label: node.label,
      disabled: node.disabled,
      depth,
      path,
      parent,
      childValues,
      descendantValues: [],
      isBranch: childValues.length > 0,
    };
    map.set(node.value, flat);
    for (const child of node.children ?? []) {
      visit(child, depth + 1, node.value, path);
    }
    const all: string[] = [];
    for (const cv of childValues) {
      all.push(cv);
      const childFlat = map.get(cv);
      if (childFlat) all.push(...childFlat.descendantValues);
    }
    flat.descendantValues = all;
  }
  for (const root of nodes) visit(root, 0, null, []);
  return map;
}

/** Walk the tree producing a flat visit order (DFS, depth-aware). */
export function flattenTree(
  nodes: TreeSelectNode[],
  index: Map<string, FlatTreeSelectNode>,
): FlatTreeSelectNode[] {
  const out: FlatTreeSelectNode[] = [];
  function visit(node: TreeSelectNode) {
    const f = index.get(node.value);
    if (f) out.push(f);
    for (const c of node.children ?? []) visit(c);
  }
  for (const root of nodes) visit(root);
  return out;
}

export type NodeCheckState = 'unchecked' | 'checked' | 'indeterminate';

/** Determine the visual check state of a node given the selected set. */
export function getCheckState(
  node: FlatTreeSelectNode,
  selectedSet: Set<string>,
): NodeCheckState {
  if (selectedSet.has(node.value)) return 'checked';
  if (!node.isBranch) return 'unchecked';
  if (!node.descendantValues.length) return 'unchecked';
  let any = false;
  let all = true;
  for (const v of node.descendantValues) {
    if (selectedSet.has(v)) any = true;
    else all = false;
  }
  if (all && any) return 'checked';
  if (any) return 'indeterminate';
  return 'unchecked';
}

/**
 * Cascade toggle: in multi+cascade mode, clicking a parent flips
 * the parent and all its enabled descendants together.
 */
export function toggleCascade(
  node: FlatTreeSelectNode,
  index: Map<string, FlatTreeSelectNode>,
  selected: Set<string>,
): Set<string> {
  const next = new Set(selected);
  const targets: string[] = [node.value, ...node.descendantValues];
  const enabledTargets = targets.filter((v) => !index.get(v)?.disabled);
  const allChecked = enabledTargets.every((v) => next.has(v));
  if (allChecked) {
    for (const v of enabledTargets) next.delete(v);
  } else {
    for (const v of enabledTargets) next.add(v);
  }
  return next;
}

export function treeSelectClass(p: {
  size: TreeSelectSize;
  open: boolean;
  disabled?: boolean;
}): string {
  return [
    'cf-treeselect',
    `cf-treeselect--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');
}
