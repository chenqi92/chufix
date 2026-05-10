import { CfSparkline } from '@chufix-design/react';

function r(n: number, base: number, jit: number) {
  return Array.from({ length: n }, () => base + (Math.random() - 0.5) * jit);
}

const kpis = [
  { label: 'ARR', value: '$ 12.4M', delta: 18.4, trend: r(20, 60, 30) },
  { label: 'MAU', value: '284k', delta: 6.2, trend: r(20, 70, 25) },
  { label: 'NPS', value: 67, delta: 4, trend: r(20, 50, 20) },
  { label: '人均 LTV', value: '$ 412', delta: -2.1, trend: r(20, 80, 15) },
];

export function ExecutiveSummary() {
  return (
    <div className="exec">
      <header className="exec__head">
        <h2>Executive Summary</h2>
        <p>2026 Q1 经营摘要 · 适合做月会幻灯片首页</p>
      </header>
      <section className="exec__kpis">
        {kpis.map((k) => (
          <article key={k.label} className="exec__kpi">
            <div className="exec__kpi-label">{k.label}</div>
            <div className="exec__kpi-value">{k.value}</div>
            <div className="exec__kpi-delta" data-tone={k.delta > 0 ? 'pos' : k.delta < 0 ? 'neg' : 'flat'}>
              {k.delta > 0 ? '+' : ''}{k.delta}%
              <span className="exec__kpi-vs">vs 上季度</span>
            </div>
            <CfSparkline data={k.trend} width={220} height={48} filled smooth />
          </article>
        ))}
      </section>
    </div>
  );
}
