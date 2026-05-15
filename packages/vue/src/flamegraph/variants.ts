export interface FlameNode {
  name: string;
  value: number;
  children?: FlameNode[];
  category?: string;
}

export interface FlameFrame {
  node: FlameNode;
  depth: number;
  x: number;
  width: number;
  path: number[];
}

export function flattenFlame(
  root: FlameNode,
  rootX = 0,
  rootWidth = 1,
  depth = 0,
  path: number[] = [],
  acc: FlameFrame[] = [],
): FlameFrame[] {
  acc.push({ node: root, depth, x: rootX, width: rootWidth, path });
  const children = root.children;
  if (!children || children.length === 0) return acc;
  const total = children.reduce((s, c) => s + c.value, 0) || root.value || 1;
  let cursor = rootX;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    const w = (c.value / total) * rootWidth;
    flattenFlame(c, cursor, w, depth + 1, [...path, i], acc);
    cursor += w;
  }
  return acc;
}

export function maxDepth(root: FlameNode): number {
  let m = 0;
  function walk(node: FlameNode, depth: number) {
    if (depth > m) m = depth;
    node.children?.forEach((c) => walk(c, depth + 1));
  }
  walk(root, 0);
  return m;
}

export function nodeAtPath(root: FlameNode, path: number[]): FlameNode | null {
  let cur: FlameNode | undefined = root;
  for (const i of path) {
    if (!cur?.children?.[i]) return null;
    cur = cur.children[i];
  }
  return cur ?? null;
}

const HASH_COLORS = [
  'oklch(68% 0.16 263)',
  'oklch(72% 0.14 78)',
  'oklch(70% 0.15 152)',
  'oklch(70% 0.18 22)',
  'oklch(70% 0.13 195)',
  'oklch(70% 0.16 320)',
  'oklch(74% 0.14 110)',
  'oklch(70% 0.1 230)',
];

export function colorFor(node: FlameNode): string {
  const key = node.category ?? node.name;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return HASH_COLORS[h % HASH_COLORS.length];
}
