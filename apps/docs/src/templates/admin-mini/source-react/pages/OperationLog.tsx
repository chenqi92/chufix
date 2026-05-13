import { useContext, useMemo, useState } from 'react';
import { CfTable, CfTag, CfSearchInput } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import { initialOpLogs, type OperationLog as OpLog } from '../mock';

export default function OperationLog() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialOpLogs;
    return initialOpLogs.filter((r) =>
      [r.user, r.action, r.resource, r.ip].some((v) => v.toLowerCase().includes(q)),
    );
  }, [search]);

  const cols = [
    { key: 'user',     title: t.col_log_user,     dataIndex: 'user',     width: 110 },
    { key: 'action',   title: t.col_log_action,   dataIndex: 'action',   width: 100 },
    { key: 'resource', title: t.col_log_resource, dataIndex: 'resource' },
    { key: 'ip',       title: t.col_log_ip,       dataIndex: 'ip',       width: 130 },
    {
      key: 'status', title: t.status, dataIndex: 'status', width: 90,
      render: (v: unknown) =>
        <CfTag size="sm" tone={v === 'ok' ? 'success' : 'danger'} variant="soft">
          {v === 'ok' ? t.status_ok : t.status_fail}
        </CfTag>,
    },
    { key: 'at', title: t.col_log_at, dataIndex: 'at', width: 180 },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <CfSearchInput modelValue={search} onUpdateModelValue={setSearch} placeholder={t.search} size="sm" style={{ width: 220 }} />
        <span className="adm-page__count">{t.total_rows.replace('{n}', String(filtered.length))}</span>
      </header>
      <CfTable columns={cols} rows={filtered} rowKey={(r: OpLog) => String(r.id)} size="sm" />
    </div>
  );
}
