import {
  CfCard,
  CfButton,
  CfTag,
  CfDataGrid,
  CfStatusCodeBadge,
  CfBanner,
  CfStat,
} from '@chufix-design/react';

const cols = [
  { key: 'date', title: '日期', dataIndex: 'date', width: 120 },
  { key: 'desc', title: '描述', dataIndex: 'desc' },
  { key: 'amount', title: '金额', dataIndex: 'amount', width: 110 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 100 },
  { key: 'pdf', title: '', dataIndex: 'pdf', width: 60 },
];
const rows = [
  { id: '1', date: '2026-04-01', desc: 'Pro 月费 · 2026-04', amount: '$ 12.00', status: 'paid' },
  { id: '2', date: '2026-03-01', desc: 'Pro 月费 · 2026-03', amount: '$ 12.00', status: 'paid' },
  { id: '3', date: '2026-02-01', desc: 'Pro 月费 · 2026-02', amount: '$ 12.00', status: 'paid' },
  { id: '4', date: '2026-01-01', desc: 'Pro 月费 · 2026-01', amount: '$ 12.00', status: 'paid' },
  { id: '5', date: '2025-12-01', desc: 'Pro 月费 · 2025-12', amount: '$ 12.00', status: 'failed' },
  { id: '6', date: '2025-11-01', desc: 'Pro 月费 · 2025-11', amount: '$ 12.00', status: 'paid' },
];

export function BillingPage() {
  return (
    <div className="bill">
      <header className="bill__head">
        <h2>账单与发票</h2>
        <p>下次扣款 · 2026-05-01</p>
      </header>

      <CfBanner
        tone="warning"
        title="付款方式即将到期"
        description="•••• 4242 卡将于 2026-07 失效，请尽快更新。"
        actions={<CfButton size="sm" variant="secondary">更新付款方式</CfButton>}
      />

      <section className="bill__row">
        <CfCard>
          <header className="bill__card-head">
            <span>当前方案</span>
            <CfTag tone="accent" size="sm">Pro</CfTag>
          </header>
          <div className="bill__plan-amount">$ 12<span>/月</span></div>
          <ul className="bill__plan-feat">
            <li>无限工作区</li>
            <li>50 GB 存储</li>
            <li>邮件 + Slack 工单</li>
          </ul>
          <CfButton variant="tertiary" block>升级到 Enterprise</CfButton>
        </CfCard>

        <CfCard>
          <header className="bill__card-head">
            <span>付款方式</span>
          </header>
          <div className="bill__pay">
            <div className="bill__pay-card">
              <span className="bill__pay-brand">VISA</span>
              <span className="bill__pay-num">•••• 4242</span>
              <span className="bill__pay-exp">07/26</span>
            </div>
            <CfButton variant="secondary" size="sm">更换</CfButton>
          </div>
        </CfCard>

        <CfCard>
          <header className="bill__card-head">
            <span>本月使用</span>
          </header>
          <div className="bill__usage">
            <CfStat label="API 调用" value="284k" />
            <CfStat label="存储" value="12.4" suffix="GB" />
          </div>
        </CfCard>
      </section>

      <section>
        <header className="bill__list-head">
          <h3>历史发票</h3>
          <CfButton variant="tertiary" size="sm">导出 CSV</CfButton>
        </header>
        <CfDataGrid columns={cols} rows={rows} />
      </section>
    </div>
  );
}
