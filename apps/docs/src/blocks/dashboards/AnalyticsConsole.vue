<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CfButton,
  CfDrawer,
  CfMetricCard,
  CfPivot,
  CfSelect,
  CfTag,
  modal,
  pivotCompute,
  toast,
  type PivotAggregator,
} from '@chufix-design/vue';

interface Order {
  region: string;
  channel: string;
  product: string;
  amount: number;
  qty: number;
}

const REGIONS = ['华北', '华东', '华南', '西部'];
const CHANNELS = ['官网', '门店', 'App', '分销'];
const PRODUCTS = ['Pro', 'Standard', 'Lite'];

function seed(): Order[] {
  const rows: Order[] = [];
  let s = 42;
  function rnd() { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 8) / 0x1000000; }
  for (const r of REGIONS) {
    for (const c of CHANNELS) {
      for (const p of PRODUCTS) {
        const n = 4 + Math.floor(rnd() * 8);
        for (let i = 0; i < n; i++) {
          rows.push({ region: r, channel: c, product: p, amount: Math.round(800 + rnd() * 9000), qty: 1 + Math.floor(rnd() * 12) });
        }
      }
    }
  }
  return rows;
}

const data = ref<Order[]>(seed());

const aggOptions = [
  { value: 'sum', label: '求和' },
  { value: 'avg', label: '平均' },
  { value: 'count', label: '计数' },
  { value: 'max', label: '最大' },
];
const aggregator = ref<PivotAggregator>('sum');

const dimensionOptions = [
  { value: 'region', label: '区域' },
  { value: 'channel', label: '渠道' },
  { value: 'product', label: '产品' },
];
const rowField = ref<keyof Order>('region');
const colField = ref<keyof Order>('channel');

const totals = computed(() => {
  const r = pivotCompute(data.value, rowField.value as string, colField.value as string, 'amount', aggregator.value);
  return r;
});

const orderCount = computed(() => data.value.length);
const grandTotal = computed(() => totals.value.grandTotal);
const avgPerOrder = computed(() => orderCount.value ? Math.round(grandTotal.value / orderCount.value) : 0);

/* drill-down drawer */
const drawerOpen = ref(false);
const drillRows = ref<Order[]>([]);
const drillTitle = ref('');

function onCellClick(p: { row: string; col: string; value: number; rows: unknown[] }) {
  drillTitle.value = `${p.row} × ${p.col}`;
  drillRows.value = p.rows as Order[];
  drawerOpen.value = true;
}

async function reloadData() {
  const ok = await modal.confirm({
    title: '重新生成模拟数据？',
    description: '会丢弃当前看板里的所有调整。',
  });
  if (!ok) return;
  data.value = seed();
  toast({ type: 'success', message: '已生成新一批数据' });
}
</script>

<template>
  <div class="ac">
    <header class="ac__head">
      <div>
        <h1 class="ac__title">销售分析看板</h1>
        <p class="ac__sub">
          <CfTag tone="info" size="sm">live</CfTag>
          点击任意单元格查看明细
        </p>
      </div>
      <CfButton variant="tertiary" @click="reloadData">重新生成数据</CfButton>
    </header>

    <div class="ac__kpis">
      <CfMetricCard label="订单数" :value="orderCount" />
      <CfMetricCard label="总额" :value="grandTotal" prefix="¥" />
      <CfMetricCard label="客单均价" :value="avgPerOrder" prefix="¥" />
      <CfMetricCard label="活跃区域" :value="totals.rowKeys.length" hint="非零行数" />
    </div>

    <section class="ac__controls">
      <label class="ac__field">
        <span>聚合方式</span>
        <CfSelect v-model="aggregator" :options="aggOptions" size="sm" style="max-width: 140px;" />
      </label>
      <label class="ac__field">
        <span>行</span>
        <CfSelect v-model="rowField" :options="dimensionOptions" size="sm" style="max-width: 140px;" />
      </label>
      <label class="ac__field">
        <span>列</span>
        <CfSelect v-model="colField" :options="dimensionOptions" size="sm" style="max-width: 140px;" />
      </label>
    </section>

    <CfPivot
      :data="data"
      :row-field="rowField"
      :col-field="colField"
      value-field="amount"
      :aggregator="aggregator"
      heatmap
      :format="(v: number) => '¥' + v.toLocaleString()"
      :on-cell-click="onCellClick"
    />

    <CfDrawer
      v-model:open="drawerOpen"
      placement="right"
      size="md"
      tone="info"
      :title="`明细：${drillTitle}`"
      :description="`命中 ${drillRows.length} 条原始记录`"
    >
      <div class="ac__detail">
        <div v-for="(r, i) in drillRows" :key="i" class="ac__detail-row">
          <span class="ac__detail-product">{{ r.product }}</span>
          <span class="ac__detail-amount">¥{{ r.amount.toLocaleString() }}</span>
          <span class="ac__detail-qty">×{{ r.qty }}</span>
        </div>
      </div>
    </CfDrawer>
  </div>
</template>

<style scoped>
.ac {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--bg-1);
  font-family: var(--font-sans);
}
.ac__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.ac__title {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-semibold);
  color: var(--fg-1);
}
.ac__sub {
  margin: 4px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-12);
  color: var(--fg-3);
}
.ac__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 720px) {
  .ac__kpis { grid-template-columns: repeat(2, 1fr); }
}
.ac__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 10px 12px;
  background: var(--bg-2);
  border-radius: 6px;
}
.ac__field {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--fg-3);
}
.ac__detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ac__detail-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  padding: 6px 8px;
  background: var(--bg-2);
  border-radius: 4px;
  font-size: 12px;
}
.ac__detail-product { font-weight: var(--w-medium); }
.ac__detail-amount { color: var(--accent-1); font-variant-numeric: tabular-nums; }
.ac__detail-qty { color: var(--fg-3); font-variant-numeric: tabular-nums; }
</style>
