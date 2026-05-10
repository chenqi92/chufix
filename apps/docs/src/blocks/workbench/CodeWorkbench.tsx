import { useState } from 'react';
import {
  CfDockLayout,
  CfTreeView,
  CfCodeEditor,
  CfAnsiText,
  CfStatusBar,
} from '@chufix-design/react';
import type { DockGroup, TreeNode } from '@chufix-design/react';

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

export function CodeWorkbench() {
  const [orders, setOrders] = useState(`import { db } from './db';

export async function fetchOrders(userId: string) {
  return db.query(\`SELECT * FROM orders WHERE user_id = $1\`, [userId]);
}
`);
  const [login, setLogin] = useState(`export async function login(email: string, password: string) {
  const res = await fetch('/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
`);

  return (
    <div className="wb">
      <div className="wb__main">
        <CfDockLayout
          layout={layout}
          slots={{
            'panel-tree': <CfTreeView nodes={tree} />,
            'panel-orders': <CfCodeEditor value={orders} onChange={setOrders} language="typescript" rows={14} />,
            'panel-login': <CfCodeEditor value={login} onChange={setLogin} language="typescript" rows={14} />,
            'panel-terminal': <CfAnsiText text={ansi} size="sm" />,
            'panel-output': <pre className="wb__pre">[14:32:01] Build succeeded in 412ms</pre>,
            'panel-problems': (
              <pre className="wb__pre">{`2 warnings
  src/orders.ts:4 · 'db' is unused
  src/login.ts:6 · prefer const`}</pre>
            ),
          }}
        />
      </div>
      <CfStatusBar leftItems={statusItems.left} rightItems={statusItems.right} />
    </div>
  );
}
