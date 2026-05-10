import { CfGauge, CfSparkline, CfLatencyHeatmap, CfStatusCodeBadge } from '@chufix/react';

function rand(n: number, base: number, jit: number) {
  return Array.from({ length: n }, () => base + (Math.random() - 0.5) * jit);
}
function row(peak: number) {
  return Array.from({ length: 24 }, (_, h) => {
    const dist = Math.abs(h - peak);
    return 60 + (24 - dist) * 8 + Math.random() * 40;
  });
}

const heatmap = [row(15), row(15), row(15), row(16), row(15), row(13), row(13)];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => (i % 4 === 0 ? `${i}h` : ''));

const services = [
  { name: 'gateway', uptime: 99.9, errors: 0 },
  { name: 'auth', uptime: 99.5, errors: 4 },
  { name: 'orders', uptime: 99.7, errors: 1 },
  { name: 'payments', uptime: 98.2, errors: 12 },
  { name: 'inventory', uptime: 99.9, errors: 0 },
  { name: 'notify', uptime: 100, errors: 0 },
];

export function MonitoringBoard() {
  return (
    <div className="mon">
      <header className="mon__head">
        <h2>Monitoring</h2>
        <p>实时系统状态 · 自动刷新 30s</p>
      </header>

      <section className="mon__gauges">
        <CfGauge value={42} label="CPU" unit="%" tone="success" size={140} />
        <CfGauge value={78} label="Memory" unit="%" tone="warning" size={140} />
        <CfGauge value={92} label="Disk" unit="%" tone="error" size={140} />
        <CfGauge value={34} label="GPU" unit="%" tone="success" size={140} />
      </section>

      <section className="mon__card">
        <h3>请求延迟热力图 · 7 天 × 24 小时</h3>
        <CfLatencyHeatmap data={heatmap} rowLabels={days} colLabels={hours} height={220} />
      </section>

      <section className="mon__card">
        <h3>服务健康度</h3>
        <ul className="mon__svc">
          {services.map((s) => (
            <li key={s.name}>
              <span className="mon__svc-name">{s.name}</span>
              <CfSparkline data={rand(20, 50, 12)} width={140} height={22} filled smooth colorIndex={s.errors > 5 ? 3 : 2} />
              <span className="mon__svc-uptime" data-warn={s.uptime < 99 ? 'true' : undefined}>{s.uptime}%</span>
              <CfStatusCodeBadge
                code={s.errors === 0 ? 200 : s.errors > 5 ? 500 : 304}
                reason={s.errors === 0 ? 'OK' : s.errors > 5 ? 'errors' : 'warn'}
                size="sm"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
