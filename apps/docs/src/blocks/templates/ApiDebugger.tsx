import { useState } from 'react';
import { CfDomainPane, CfTreeView, CfMethodBadge, CfStatusCodeBadge, CfKVEditor, CfDescriptionList } from '@chufix/react';

const collection = [
  { id: 'auth', label: 'auth/', children: [
    { id: 'login', label: 'POST /login' },
    { id: 'logout', label: 'POST /logout' },
  ]},
  { id: 'orders', label: 'orders/', children: [
    { id: 'list', label: 'GET /orders' },
    { id: 'create', label: 'POST /orders' },
  ]},
];

const respMeta = [
  { label: 'Status', value: '200 OK' },
  { label: 'Time', value: '288ms' },
  { label: 'Size', value: '4.2 KB' },
];

export function ApiDebugger() {
  const [headers, setHeaders] = useState([
    { key: 'Authorization', value: 'Bearer {{token}}', enabled: true },
    { key: 'Accept', value: 'application/json', enabled: true },
    { key: 'X-Trace-Id', value: '{{trace_id}}', enabled: false },
  ]);

  return (
    <div style={{ height: 360 }}>
      <CfDomainPane
        slots={{
          'panel-collection': <CfTreeView nodes={collection} />,
          'panel-request': (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CfMethodBadge kind="post" />
                <span style={{ fontFamily: 'var(--font-mono)' }}>/v1/orders</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 4 }}>Headers</div>
                <CfKVEditor value={headers} onChange={setHeaders} />
              </div>
            </div>
          ),
          'panel-response': (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CfStatusCodeBadge code={201} reason="Created" />
              <CfDescriptionList items={respMeta} />
              <pre style={{ margin: 0, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg-2)', borderRadius: 'var(--r-3)' }}>
{`{
  "id": "ord_1842",
  "amount": 12340
}`}
              </pre>
            </div>
          ),
          'panel-mock': <p style={{ color: 'var(--fg-2)', fontSize: 13 }}>Mock 规则配置（基于 CfCard + CfSwitch）。</p>,
          'panel-workflow': <p style={{ color: 'var(--fg-2)', fontSize: 13 }}>自动化工作流节点（基于 CfKanban）。</p>,
        }}
      />
    </div>
  );
}
