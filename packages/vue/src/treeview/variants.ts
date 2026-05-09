export type TreeViewSize = 'sm' | 'md' | 'lg';

export interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  /** Lazy-load: when true and children is empty, expanding triggers loadChildren. */
  isLeaf?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  modelValue?: string[];
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  checkable?: boolean;
  /** Cascade selection between parent and children when checkable. */
  cascade?: boolean;
  selectable?: 'single' | 'multiple';
  selectedKey?: string | null;
  size?: TreeViewSize;
  showLine?: boolean;
  emptyText?: string;
}

export function treeViewClass(p: {
  size: TreeViewSize;
  showLine: boolean;
  checkable: boolean;
}): string {
  return [
    'cf-tree',
    `cf-tree--${p.size}`,
    p.showLine && 'is-lined',
    p.checkable && 'is-checkable',
  ]
    .filter(Boolean)
    .join(' ');
}

export function flattenKeys(nodes: TreeNode[]): string[] {
  const out: string[] = [];
  const visit = (list: TreeNode[]) => {
    for (const n of list) {
      out.push(n.key);
      if (n.children?.length) visit(n.children);
    }
  };
  visit(nodes);
  return out;
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

export function findParents(
  nodes: TreeNode[],
  target: string,
): TreeNode[] {
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
