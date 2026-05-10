import { useMemo, useState } from 'react';
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
} from '@chufix-design/react';

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

const aggOptions = [
  { value: 'sum', label: '求和' },
  { value: 'avg', label: '平均' },
  { value: 'count', label: '计数' },
  { value: 'max', label: '最大' },
];

const dimensionOptions = [
  { value: 'region', label: '区域' },
  { value: 'channel', label: '渠道' },
  { value: 'product', label: '产品' },
];

export function AnalyticsConsole() {
  const [data, setData] = useState<Order[]>(seed);
  const [aggregator, setAggregator] = useState<PivotAggregator>('sum');
  const [rowField, setRowField] = useState<keyof Order>('region');
  const [colField, setColField] = useState<keyof Order>('channel');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drillRows, setDrillRows] = useState<Order[]>([]);
  const [drillTitle, setDrillTitle] = useState('');

  const totals = useMemo(
    () => pivotCompute(data, rowField, colField, 'amount', aggregator),
    [data, rowField, colField, aggregator],
  );
  const orderCount = data.length;
  const grandTotal = totals.grandTotal;
  const avgPerOrder = orderCount ? Math.round(grandTotal / orderCount) : 0;

  async function reloadData() {
    const ok = await modal.confirm({
      title: '重新生成模拟数据？',
      description: '会丢弃当前看板里的所有调整。',
    });
    if (!ok) return;
    setData(seed());
    toast({ type: 'success', message: '已生成新一批数据' });
  }

  return (
    <div className="ac">
      <header className="ac__head">
        <div>
          <h1 className="ac__title">销售分析看板</h1>
          <p className="ac__sub">
            <CfTag tone="info" size="sm">
              live
            </CfTag>
            点击任意单元格查看明细
          </p>
        </div>
        <CfButton variant="tertiary" onClick={reloadData}>
          重新生成数据
        </CfButton>
      </header>

      <div className="ac__kpis">
        <CfMetricCard label="订单数" value={orderCount} />
        <CfMetricCard label="总额" value={grandTotal} prefix="¥" />
        <CfMetricCard label="客单均价" value={avgPerOrder} prefix="¥" />
        <CfMetricCard label="活跃区域" value={totals.rowKeys.length} hint="非零行数" />
      </div>

      <section className="ac__controls">
        <label className="ac__field">
          <span>聚合方式</span>
          <CfSelect
            value={aggregator}
            options={aggOptions}
            size="sm"
            onChange={(v) => setAggregator(v as PivotAggregator)}
          />
        </label>
        <label className="ac__field">
          <span>行</span>
          <CfSelect
            value={rowField}
            options={dimensionOptions}
            size="sm"
            onChange={(v) => setRowField(v as keyof Order)}
          />
        </label>
        <label className="ac__field">
          <span>列</span>
          <CfSelect
            value={colField}
            options={dimensionOptions}
            size="sm"
            onChange={(v) => setColField(v as keyof Order)}
          />
        </label>
      </section>

      <CfPivot<Order>
        data={data}
        rowField={rowField}
        colField={colField}
        valueField="amount"
        aggregator={aggregator}
        heatmap
        format={(v) => '¥' + v.toLocaleString()}
        onCellClick={(p) => {
          setDrillTitle(`${p.row} × ${p.col}`);
          setDrillRows(p.rows as Order[]);
          setDrawerOpen(true);
        }}
      />

      <CfDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        placement="right"
        size="md"
        tone="info"
        title={`明细：${drillTitle}`}
        description={`命中 ${drillRows.length} 条原始记录`}
      >
        <div className="ac__detail">
          {drillRows.map((r, i) => (
            <div key={i} className="ac__detail-row">
              <span className="ac__detail-product">{r.product}</span>
              <span className="ac__detail-amount">¥{r.amount.toLocaleString()}</span>
              <span className="ac__detail-qty">×{r.qty}</span>
            </div>
          ))}
        </div>
      </CfDrawer>
    </div>
  );
}
