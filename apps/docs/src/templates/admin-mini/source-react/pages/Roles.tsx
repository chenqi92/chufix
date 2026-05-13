import { useContext } from 'react';
import { CfTable, CfTag } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import { initialRoles, type AdminRole } from '../mock';

export default function Roles() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const cols = [
    { key: 'name', title: t.col_role_name, dataIndex: 'name', width: 160 },
    { key: 'description', title: t.col_role_desc, dataIndex: 'description' },
    {
      key: 'permissions', title: t.col_role_perms, dataIndex: 'permissions',
      render: (v: unknown) => (
        <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
          {(v as string[]).map((p) => (
            <CfTag key={p} size="sm" variant="outline" tone="primary">{p}</CfTag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="adm-page">
      <CfTable columns={cols} rows={initialRoles} rowKey={(r: AdminRole) => r.id} size="sm" />
    </div>
  );
}
