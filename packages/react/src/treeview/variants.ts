export type TreeViewSize = 'sm' | 'md' | 'lg';

export interface TreeNode {
  key: string;
  label: import('react').ReactNode;
  icon?: import('react').ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  isLeaf?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  value?: string[];
  defaultValue?: string[];
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  checkable?: boolean;
  cascade?: boolean;
  selectable?: 'single' | 'multiple';
  selectedKey?: string | null;
  size?: TreeViewSize;
  showLine?: boolean;
  emptyText?: import('react').ReactNode;
  className?: string;
  onChange?: (keys: string[]) => void;
  onExpandedKeysChange?: (keys: string[]) => void;
  onSelectedKeyChange?: (key: string | null) => void;
  onSelect?: (node: TreeNode) => void;
  onExpand?: (node: TreeNode, expanded: boolean) => void;
  onCheck?: (node: TreeNode, checked: boolean) => void;
}

export function treeViewClass(p: {
  size: TreeViewSize;
  showLine: boolean;
  checkable: boolean;
  className?: string;
}): string {
  return [
    'cf-tree',
    `cf-tree--${p.size}`,
    p.showLine && 'is-lined',
    p.checkable && 'is-checkable',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function descendantKeys(node: TreeNode): string[] {
  const out: string[] = [];
  const visit = (n: TreeNode) => {
    if (n.children?.length) {
      for (const c of n.children) {
        out.push(c.key);
        visit(c);
      }
    }
  };
  visit(node);
  return out;
}

export function findParents(nodes: TreeNode[], target: string): TreeNode[] {
  const path: TreeNode[] = [];
  const dfs = (list: TreeNode[]): boolean => {
    for (const n of list) {
      if (n.key === target) return true;
      if (n.children?.length) {
        path.push(n);
        if (dfs(n.children)) return true;
        path.pop();
      }
    }
    return false;
  };
  dfs(nodes);
  return path;
}

export function isAllDescendantsChecked(
  node: TreeNode,
  set: Set<string>,
): boolean {
  if (!node.children?.length) return set.has(node.key);
  return node.children.every((c) => isAllDescendantsChecked(c, set));
}
