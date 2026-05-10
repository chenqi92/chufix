import { useState } from 'react';
import {
  CfSplitter,
  CfTreeView,
  CfCodeEditor,
  CfDataGrid,
  CfTabs,
  CfTabPanel,
  CfButton,
  CfStatusCodeBadge,
} from '@chufix/react';
import type { TreeNode } from '@chufix/react';

const schema: TreeNode[] = [
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'users', label: 'users · 12,400 行' },
      { id: 'orders', label: 'orders · 184,200 行' },
      { id: 'payments', label: 'payments · 62,810 行' },
    ],
  },
  {
    id: 'analytics',
    label: 'analytics',
    children: [
      { id: 'events', label: 'events · 4.2M 行' },
      { id: 'sessions', label: 'sessions · 920k 行' },
    ],
  },
];

const cols = [
  { key: 'id', title: 'id', dataIndex: 'id', width: 70 },
  { key: 'amount', title: 'amount', dataIndex: 'amount', width: 100 },
  { key: 'email', title: 'email', dataIndex: 'email' },
  {
    key: 'status',
    title: 'status',
    dataIndex: 'status',
    width: 110,
    render: (_v: unknown, row: any) => <CfStatusCodeBadge code={row.status} size="sm" />,
  },
];
const rows = [
  { id: '1842', amount: '¥ 480.00', email: 'jane.l@example.com', status: 200 },
  { id: '1841', amount: '¥ 1,200.00', email: 'bob@example.com', status: 200 },
  { id: '1840', amount: '¥ 88.00', email: 'alice@example.com', status: 500 },
  { id: '1839', amount: '¥ 240.00', email: 'tim@example.com', status: 200 },
  { id: '1838', amount: '¥ 3,180.00', email: 'sue@example.com', status: 200 },
  { id: '1837', amount: '¥ 96.00', email: 'kim@example.com', status: 304 },
];

const history = [
  { id: '1', sql: 'SELECT count(*) FROM orders;', when: '2m 前' },
  { id: '2', sql: 'UPDATE users SET status=...', when: '14m 前' },
];

export function DbWorkbench() {
  const [sql, setSql] = useState(`SELECT
  o.id,
  o.amount,
  u.email,
  p.status
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN payments p ON p.order_id = o.id
WHERE o.created_at > now() - interval '7 days'
ORDER BY o.created_at DESC
LIMIT 20;`);

  const editor = (
    <div className="db__editor">
      <div className="db__bar">
        <CfButton variant="primary" size="sm">▶ 运行</CfButton>
        <CfButton variant="tertiary" size="sm">保存</CfButton>
        <span className="db__hint">Ctrl + Enter 运行</span>
      </div>
      <CfCodeEditor value={sql} onChange={setSql} language="sql" rows={6} />
    </div>
  );

  const result = (
    <CfTabs
      defaultValue="result"
      items={[
        { value: 'result', label: '结果 · 6 行' },
        { value: 'history', label: '历史' },
        { value: 'messages', label: '消息' },
      ]}
    >
      {({ active }) => (
        <>
          <CfTabPanel value="result" active={active}>
            <CfDataGrid columns={cols} rows={rows} />
          </CfTabPanel>
          <CfTabPanel value="history" active={active}>
            <ul className="db__hist">
              {history.map((h) => (
                <li key={h.id}>
                  <code>{h.sql}</code>
                  <span className="db__hist-time">{h.when}</span>
                </li>
              ))}
            </ul>
          </CfTabPanel>
          <CfTabPanel value="messages" active={active}>
            <pre className="db__msg">[14:32:01] Query OK · 6 rows · 38ms</pre>
          </CfTabPanel>
        </>
      )}
    </CfTabs>
  );

  const sidebar = (
    <div className="db__pane">
      <h3>Schema</h3>
      <CfTreeView nodes={schema} />
    </div>
  );

  const main = (
    <CfSplitter
      orientation="vertical"
      defaultValue={160}
      unit="px"
      start={editor}
      end={result}
    />
  );

  return (
    <div className="db">
      <CfSplitter
        orientation="horizontal"
        defaultValue={220}
        unit="px"
        start={sidebar}
        end={main}
      />
    </div>
  );
}
