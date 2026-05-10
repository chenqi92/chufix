<script setup lang="ts">
import {
  CfCard,
  CfButton,
  CfTag,
  CfDataGrid,
  CfStatusCodeBadge,
  CfBanner,
  CfStat,
} from '@chufix/vue';

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
</script>

<template>
  <div class="bill">
    <header class="bill__head">
      <h2>账单与发票</h2>
      <p>下次扣款 · 2026-05-01</p>
    </header>

    <CfBanner
      tone="warning"
      title="付款方式即将到期"
      description="•••• 4242 卡将于 2026-07 失效，请尽快更新。"
    >
      <template #actions>
        <CfButton size="sm" variant="secondary">更新付款方式</CfButton>
      </template>
    </CfBanner>

    <section class="bill__row">
      <CfCard>
        <header class="bill__card-head">
          <span>当前方案</span>
          <CfTag tone="accent" size="sm">Pro</CfTag>
        </header>
        <div class="bill__plan">
          <div class="bill__plan-amount">$ 12<span>/月</span></div>
          <ul class="bill__plan-feat">
            <li>无限工作区</li>
            <li>50 GB 存储</li>
            <li>邮件 + Slack 工单</li>
          </ul>
        </div>
        <CfButton variant="tertiary" block>升级到 Enterprise</CfButton>
      </CfCard>

      <CfCard>
        <header class="bill__card-head">
          <span>付款方式</span>
        </header>
        <div class="bill__pay">
          <div class="bill__pay-card">
            <span class="bill__pay-brand">VISA</span>
            <span class="bill__pay-num">•••• 4242</span>
            <span class="bill__pay-exp">07/26</span>
          </div>
          <CfButton variant="secondary" size="sm">更换</CfButton>
        </div>
      </CfCard>

      <CfCard>
        <header class="bill__card-head">
          <span>本月使用</span>
        </header>
        <div class="bill__usage">
          <CfStat label="API 调用" value="284k" />
          <CfStat label="存储" value="12.4" suffix="GB" />
        </div>
      </CfCard>
    </section>

    <section>
      <header class="bill__list-head">
        <h3>历史发票</h3>
        <CfButton variant="tertiary" size="sm">导出 CSV</CfButton>
      </header>
      <CfDataGrid :columns="cols" :rows="rows">
        <template #cell-status="{ row }">
          <CfStatusCodeBadge :code="row.status === 'paid' ? 200 : 500" :reason="row.status === 'paid' ? '已支付' : '失败'" size="sm" />
        </template>
        <template #cell-pdf>
          <CfButton variant="ghost" size="sm">PDF</CfButton>
        </template>
      </CfDataGrid>
    </section>
  </div>
</template>

<style scoped>
.bill {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-sans);
}
.bill__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.bill__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.bill__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.bill__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
.bill__plan-amount {
  font-size: 32px;
  font-weight: 600;
  color: var(--fg-1);
  margin-bottom: 8px;
}
.bill__plan-amount span {
  font-size: var(--t-12);
  font-weight: 400;
  color: var(--fg-3);
}
.bill__plan-feat {
  margin: 0 0 16px;
  padding: 0 0 0 16px;
  font-size: var(--t-12);
  color: var(--fg-2);
}
.bill__pay {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.bill__pay-card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg-2);
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  font-family: var(--font-mono);
  font-size: var(--t-12);
}
.bill__pay-brand {
  font-weight: 700;
  color: var(--accent-1);
}
.bill__pay-num {
  color: var(--fg-1);
}
.bill__pay-exp {
  color: var(--fg-3);
}
.bill__usage {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.bill__list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.bill__list-head h3 {
  margin: 0;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
</style>
