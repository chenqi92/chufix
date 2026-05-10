export type TreeSelectSize = 'sm' | 'md' | 'lg';

export interface TreeSelectNode {
  value: string;
  label: string;
  disabled?: boolean;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  modelValue?: string | string[];
  options: TreeSelectNode[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: TreeSelectSize;
}

export interface FlatTreeSelectNode extends TreeSelectNode {
  depth: number;
  path: string[];
}

export function flattenTreeSelect(nodes: TreeSelectNode[], depth = 0, path: string[] = []): FlatTreeSelectNode[] {
  return nodes.flatMap((node) => {
    const next = { ...node, depth, path: [...path, node.label] };
    return [next, ...flattenTreeSelect(node.children ?? [], depth + 1, next.path)];
  });
}

export function treeSelectClass(p: { size: TreeSelectSize; open: boolean; disabled?: boolean }): string {
  return [
    'cf-treeselect',
    `cf-treeselect--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
  ].filter(Boolean).join(' ');
}
