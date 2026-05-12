import { useContext, useMemo, useState } from 'react';
import { CfTable, CfTag, CfSearchInput } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import { initialLoginLogs, type LoginLog as LL } from '../mock';

export default function LoginLog() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialLoginLogs;
    return initialLoginLogs.filter((r) =>
      [r.user, r.ip, r.ua].some((v) => v.toLowerCase().includes(q)),
    );
  }, [search]);

  const cols = [
    { key: 'user', title: t.col_log_user, dataIndex: 'user', width: 110 },
    { key: 'ip',   title: t.col_log_ip,   dataIndex: 'ip',   width: 140 },
    { key: 'ua',   title: t.col_log_ua,   dataIndex: 'ua' },
    {
      key: 'status', title: t.status, dataIndex: 'status', width: 90,
      render: (v: unknown) =>
        <CfTag size="sm" tone={v === 'success' ? 'success' : 'danger'} variant="soft">
          {v === 'success' ? t.status_success : t.status_failed}
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
      <CfTable columns={cols} rows={filtered} rowKey={(r: LL) => String(r.id)} size="sm" />
    </div>
  );
}
