import { useContext } from 'react';
import { CfStat, CfTable, CfTag } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import {
  initialUsers,
  initialRoles,
  initialOpLogs,
  initialLoginLogs,
  type OperationLog,
  type LoginLog,
} from '../mock';

export default function Dashboard() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const kpis = [
    { label: t.kpi_users,       value: initialUsers.length,  trend: { delta: '+2', direction: 'up' as const } },
    { label: t.kpi_roles,       value: initialRoles.length,  trend: { delta: '+1', direction: 'up' as const } },
    { label: t.kpi_login_today, value: 38,                   trend: { delta: '+12%', direction: 'up' as const } },
    { label: t.kpi_op_today,    value: 142,                  trend: { delta: '-4%',  direction: 'down' as const } },
  ];

  const opCols = [
    { key: 'user',     title: t.col_log_user,     dataIndex: 'user',     width: 100 },
    { key: 'action',   title: t.col_log_action,   dataIndex: 'action',   width: 90 },
    { key: 'resource', title: t.col_log_resource, dataIndex: 'resource' },
    { key: 'at',       title: t.col_log_at,       dataIndex: 'at',       width: 180 },
  ];
  const loginCols = [
    { key: 'user', title: t.col_log_user, dataIndex: 'user', width: 100 },
    { key: 'ip',   title: t.col_log_ip,   dataIndex: 'ip',   width: 130 },
    { key: 'ua',   title: t.col_log_ua,   dataIndex: 'ua' },
    { key: 'at',   title: t.col_log_at,   dataIndex: 'at',   width: 180 },
  ];

  return (
    <div className="adm-dashboard">
      <div className="adm-dashboard__kpis">
        {kpis.map((k) => (
          <CfStat key={k.label} label={k.label} value={k.value} trend={k.trend} variant="outlined" />
        ))}
      </div>
      <div className="adm-dashboard__pair">
        <section className="adm-card">
          <header className="adm-card__head">
            <h3>{t.recent_op}</h3>
            <CfTag size="sm" tone="info">live</CfTag>
          </header>
          <CfTable columns={opCols} rows={initialOpLogs.slice(0, 5)} rowKey={(r: OperationLog) => String(r.id)} size="sm" />
        </section>
        <section className="adm-card">
          <header className="adm-card__head">
            <h3>{t.recent_login}</h3>
            <CfTag size="sm" tone="success">stable</CfTag>
          </header>
          <CfTable columns={loginCols} rows={initialLoginLogs.slice(0, 5)} rowKey={(r: LoginLog) => String(r.id)} size="sm" />
        </section>
      </div>
    </div>
  );
}
