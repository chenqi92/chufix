import {
  CfMetricCard,
  CfLineChart,
  CfDonutChart,
  CfDataGrid,
  CfMethodBadge,
  CfStatusCodeBadge,
} from '@chufix-design/react';

const series = [
  { name: '请求量', data: [1240, 1480, 1650, 2030, 2180, 2310, 2620, 2480, 2790, 3020, 3140, 3380] },
  { name: '错误数', data: [12, 18, 21, 26, 22, 30, 38, 32, 41, 47, 52, 58] },
];

const trafficSeg = [
  { name: '搜索', value: 4280 },
  { name: '直接', value: 2240 },
  { name: '社交', value: 1820 },
  { name: '邮件', value: 940 },
];

const cols = [
  {
    key: 'method',
    title: '方法',
    dataIndex: 'method',
    width: 80,
    render: (_v: unknown, row: any) => <CfMethodBadge kind={row.method} />,
  },
  { key: 'path', title: '路径', dataIndex: 'path' },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (_v: unknown, row: any) => <CfStatusCodeBadge code={row.status} />,
  },
  { key: 'time', title: '耗时', dataIndex: 'time', width: 80 },
  { key: 'when', title: '时间', dataIndex: 'when', width: 90 },
];
const rows = [
  { id: '1', method: 'GET', path: '/v1/orders', status: 200, time: '88ms', when: '2m 前' },
  { id: '2', method: 'POST', path: '/v1/orders', status: 201, time: '142ms', when: '3m 前' },
  { id: '3', method: 'PUT', path: '/v1/orders/{id}', status: 200, time: '94ms', when: '4m 前' },
  { id: '4', method: 'GET', path: '/v1/users/me', status: 304, time: '14ms', when: '5m 前' },
  { id: '5', method: 'POST', path: '/v1/login', status: 401, time: '38ms', when: '6m 前' },
  { id: '6', method: 'DELETE', path: '/v1/orders/{id}', status: 500, time: '212ms', when: '7m 前' },
];

function rand(n: number, base: number, jit: number) {
  return Array.from({ length: n }, () => base + (Math.random() - 0.5) * jit);
}

export function DashboardOverview() {
  return (
    <div className="dash">
      <header className="dash__head">
        <div>
          <h2 className="dash__title">Overview</h2>
          <p className="dash__sub">2026 年 5 月 · 实时数据</p>
        </div>
      </header>

      <section className="dash__metrics">
        <CfMetricCard label="今日请求" value="28,420" delta={12.4} trend={rand(20, 65, 28)} />
        <CfMetricCard label="活跃用户" value="3,180" delta={-2.1} trend={rand(20, 80, 18)} />
        <CfMetricCard label="错误率" value="0.42" unit="%" delta={-0.08} trend={rand(20, 40, 22)} />
        <CfMetricCard label="付费转化" value="6.2" unit="%" delta={0.4} trend={rand(20, 55, 12)} />
      </section>

      <section className="dash__row">
        <div className="dash__card dash__card--wide">
          <header className="dash__card-head">
            <span>请求量趋势 · 12h</span>
            <span className="dash__card-sub">peak 3,380</span>
          </header>
          <CfLineChart series={series} smooth height={200} />
        </div>
        <div className="dash__card">
          <header className="dash__card-head">
            <span>流量来源</span>
          </header>
          <CfDonutChart segments={trafficSeg} size={160} thickness={20} centerValue="9.3k" centerLabel="今日访问" />
        </div>
      </section>

      <section className="dash__card">
        <header className="dash__card-head">
          <span>最近请求</span>
          <span className="dash__card-sub">last 6</span>
        </header>
        <CfDataGrid columns={cols} rows={rows} />
      </section>
    </div>
  );
}
