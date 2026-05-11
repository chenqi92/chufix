<script setup lang="ts">
import { ref } from 'vue';
import {
  CfDockLayout,
  CfTreeView,
  CfCodeEditor,
  CfAnsiText,
  CfStatusBar,
} from '@chufix-design/vue';
import type { DockGroup, TreeNode } from '@chufix-design/vue';

const tree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'orders', label: 'orders.ts' },
      { id: 'login', label: 'login.ts' },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'pkg', label: 'package.json' },
  { id: 'tsconfig', label: 'tsconfig.json' },
];

const layout: DockGroup = {
  id: 'root',
  orientation: 'horizontal',
  children: [
    {
      id: 'left',
      orientation: 'vertical',
      panels: [{ id: 'tree', title: 'Explorer', closable: false }],
      size: '220px',
    },
    {
      id: 'main',
      orientation: 'vertical',
      children: [
        {
          id: 'editor',
          orientation: 'horizontal',
          panels: [
            { id: 'orders', title: 'orders.ts', closable: true, detachable: true },
            { id: 'login', title: 'login.ts', closable: true, detachable: true },
          ],
        },
        {
          id: 'bottom',
          orientation: 'horizontal',
          panels: [
            { id: 'terminal', title: 'Terminal', closable: false },
            { id: 'output', title: 'Output', closable: false },
            { id: 'problems', title: 'Problems', closable: false },
          ],
          size: '180px',
        },
      ],
    },
  ],
};

const orders = ref(`import { db } from './db';

export async function fetchOrders(userId: string) {
  return db.query(\`SELECT * FROM orders WHERE user_id = $1\`, [userId]);
}
`);
const login = ref(`export async function login(email: string, password: string) {
  const res = await fetch('/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
`);

const ansi =
  '\x1b[36m$\x1b[0m pnpm dev\n\x1b[2m[vite]\x1b[0m dev server running at \x1b[36mhttp://localhost:5173\x1b[0m\n\x1b[1;32m✓\x1b[0m ready in 412ms\n';

const statusItems = {
  left: [
    { id: 'branch', label: '⎇ main' },
    { id: 'sync', label: '↑ 0 ↓ 0' },
    { id: 'errors', label: '✗ 0', tone: 'error' as const },
    { id: 'warnings', label: '⚠ 2', tone: 'warning' as const },
  ],
  right: [
    { id: 'lang', label: 'TypeScript' },
    { id: 'eol', label: 'LF' },
    { id: 'enc', label: 'UTF-8' },
  ],
};
</script>

<template>
  <div class="wb">
    <div class="wb__main">
      <CfDockLayout :layout="layout">
        <template #panel-tree>
          <CfTreeView :nodes="tree" />
        </template>
        <template #panel-orders>
          <CfCodeEditor v-model="orders" language="typescript" :rows="14" />
        </template>
        <template #panel-login>
          <CfCodeEditor v-model="login" language="typescript" :rows="14" />
        </template>
        <template #panel-terminal>
          <CfAnsiText :text="ansi" size="sm" />
        </template>
        <template #panel-output>
          <pre class="wb__pre">[14:32:01] Build succeeded in 412ms</pre>
        </template>
        <template #panel-problems>
          <pre class="wb__pre">2 warnings
  src/orders.ts:4 · 'db' is unused
  src/login.ts:6 · prefer const</pre>
        </template>
      </CfDockLayout>
    </div>
    <CfStatusBar :left-items="statusItems.left" :right-items="statusItems.right" />
  </div>
</template>

<style scoped>
.wb {
  display: flex;
  flex-direction: column;
  height: 600px;
  font-family: var(--font-sans);
}
.wb__main {
  flex: 1;
  min-height: 0;
}
.wb__pre {
  margin: 0;
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: var(--t-12);
  color: var(--fg-2);
  white-space: pre;
}
</style>
