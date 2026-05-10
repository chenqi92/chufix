import { useMemo, useRef, useState } from 'react';
import {
  CfButton,
  CfDrawer,
  CfForm,
  CfFormField,
  CfInput,
  CfMetricCard,
  CfTag,
  CfTimelineGantt,
  drawer,
  modal,
  toast,
  type FieldRules,
  type GanttBar,
  type GanttRow,
} from '@chufix-design/react';

function iso(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const initialRows: GanttRow[] = [
  {
    id: 'phase-1',
    group: 'Phase 1 · 设计',
    label: '高保真稿',
    bars: [{ id: 'p1d', label: '高保真', start: iso(-7), end: iso(-1), progress: 1, color: 'oklch(64% 0.16 263)' }],
  },
  {
    id: 'phase-1-rev',
    group: 'Phase 1 · 设计',
    label: '设计评审',
    bars: [{ id: 'p1r', label: '评审 + 改稿', start: iso(-1), end: iso(2), progress: 0.6, color: 'oklch(64% 0.16 263)' }],
  },
  {
    id: 'phase-2',
    group: 'Phase 2 · 前端',
    label: '组件库接入',
    bars: [{ id: 'p2c', label: '接入 chufix', start: iso(2), end: iso(6), progress: 0.2, color: 'oklch(70% 0.13 175)' }],
  },
  {
    id: 'phase-2b',
    group: 'Phase 2 · 前端',
    label: '页面拼装',
    bars: [{ id: 'p2p', label: 'pages', start: iso(6), end: iso(12), color: 'oklch(70% 0.13 175)' }],
  },
  {
    id: 'phase-3',
    group: 'Phase 3 · 后端',
    label: 'API 联调',
    bars: [{ id: 'p3a', label: '/orders', start: iso(8), end: iso(13), color: 'oklch(74% 0.16 80)' }],
  },
  {
    id: 'phase-4',
    group: 'Phase 4 · 测试',
    label: '回归 + 上线',
    bars: [
      { id: 'p4t', label: '回归', start: iso(13), end: iso(16), color: 'oklch(64% 0.18 30)' },
      { id: 'p4d', label: '上线', start: iso(17), end: iso(18), color: 'oklch(64% 0.18 30)' },
    ],
  },
];

const dependencies = [
  { from: 'p1d', to: 'p1r' },
  { from: 'p1r', to: 'p2c' },
  { from: 'p2c', to: 'p2p' },
  { from: 'p2p', to: 'p3a' },
  { from: 'p3a', to: 'p4t' },
  { from: 'p4t', to: 'p4d' },
];

const editRules: Record<string, FieldRules> = {
  label: [{ required: true, min: 1, max: 32 }],
  start: [{ required: true }],
  end: [{ required: true }],
};

export function ProjectPlan() {
  const [rows, setRows] = useState<GanttRow[]>(initialRows);
  const [editing, setEditing] = useState<{ bar: GanttBar; row: GanttRow } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const draftRef = useRef({ label: '', start: '', end: '' });

  const totals = useMemo(() => {
    let bars = 0;
    let done = 0;
    let min = Infinity;
    let max = -Infinity;
    for (const r of rows) {
      for (const b of r.bars) {
        bars++;
        if ((b.progress ?? 0) >= 1) done++;
        const s = new Date(b.start as string).getTime();
        const e = new Date(b.end as string).getTime();
        if (s < min) min = s;
        if (e > max) max = e;
      }
    }
    return {
      bars,
      days: Math.round((max - min) / 86400000) + 1,
      pct: bars ? Math.round((done / bars) * 100) : 0,
    };
  }, [rows]);

  function openEdit(bar: GanttBar, row: GanttRow) {
    setEditing({ bar, row });
    draftRef.current = {
      label: bar.label ?? '',
      start: String(bar.start),
      end: String(bar.end),
    };
    setEditOpen(true);
  }

  function saveEdit({ valid }: { valid: boolean }) {
    if (!valid || !editing) return;
    const { label, start, end } = draftRef.current;
    if (new Date(end) < new Date(start)) {
      toast({ type: 'error', message: '结束日期不能早于开始' });
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === editing.row.id
          ? {
              ...r,
              bars: r.bars.map((b) =>
                b.id === editing.bar.id ? { ...b, label, start, end } : b,
              ),
            }
          : r,
      ),
    );
    setEditOpen(false);
    toast({ type: 'success', message: '已保存' });
  }

  async function deleteBar() {
    if (!editing) return;
    const ok = await modal.danger({
      title: '删除该任务条？',
      description: '该操作不可撤销。',
      okText: '删除',
    });
    if (!ok) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editing.row.id ? { ...r, bars: r.bars.filter((b) => b.id !== editing.bar.id) } : r,
      ),
    );
    setEditOpen(false);
    toast({ type: 'info', message: `已删除：${editing.bar.label ?? editing.bar.id}` });
  }

  async function exportPlan() {
    const ok = await drawer.confirm({
      title: '导出方案',
      description: '将当前甘特图序列化为 JSON，复制到剪贴板。',
      placement: 'right',
      size: 'sm',
      okText: '复制',
      content: `当前共 ${totals.bars} 个任务条，跨度 ${totals.days} 天。`,
    });
    if (!ok) return;
    await navigator.clipboard.writeText(JSON.stringify({ rows, dependencies }, null, 2));
    toast({ type: 'success', message: 'JSON 已复制' });
  }

  return (
    <div className="project-plan">
      <header className="project-plan__head">
        <div>
          <h1 className="project-plan__title">v0.4 发布计划</h1>
          <p className="project-plan__subtitle">
            <CfTag tone="info" size="sm">progress</CfTag>
            截止 {iso(18)}
          </p>
        </div>
        <CfButton onClick={exportPlan}>导出方案</CfButton>
      </header>

      <div className="project-plan__kpis">
        <CfMetricCard label="任务总数" value={totals.bars} hint="跨 4 个阶段" />
        <CfMetricCard label="跨度（天）" value={totals.days} />
        <CfMetricCard label="完成度" value={totals.pct} suffix="%" trend="up" />
        <CfMetricCard label="依赖关系" value={dependencies.length} hint="from→to 配对" />
      </div>

      <CfTimelineGantt
        rows={rows}
        dependencies={dependencies}
        start={iso(-10)}
        end={iso(22)}
        dayWidth={24}
        rowHeight={38}
        editable
        onBarClick={openEdit}
        onBarChange={(p) => {
          setRows((prev) =>
            prev.map((r) => ({
              ...r,
              bars: r.bars.map((b) =>
                b.id === p.bar.id
                  ? {
                      ...b,
                      start: p.next.start.toISOString().slice(0, 10),
                      end: p.next.end.toISOString().slice(0, 10),
                    }
                  : b,
              ),
            })),
          );
        }}
      />

      <CfDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        placement="right"
        size="md"
        title={`编辑：${editing?.bar.label ?? ''}`}
        description="任务条点击触发；改动写回 model。"
      >
        <CfForm
          layout="vertical"
          model={draftRef.current}
          rules={editRules}
          onSubmit={saveEdit}
        >
          <CfFormField name="label" label="任务名">
            <CfInput
              defaultValue={draftRef.current.label}
              onChange={(e) => (draftRef.current.label = e.target.value)}
            />
          </CfFormField>
          <CfFormField name="start" label="开始日期">
            <CfInput
              defaultValue={draftRef.current.start}
              onChange={(e) => (draftRef.current.start = e.target.value)}
            />
          </CfFormField>
          <CfFormField name="end" label="结束日期">
            <CfInput
              defaultValue={draftRef.current.end}
              onChange={(e) => (draftRef.current.end = e.target.value)}
            />
          </CfFormField>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <CfButton variant="danger" type="button" onClick={deleteBar}>
              删除
            </CfButton>
            <div style={{ display: 'flex', gap: 8 }}>
              <CfButton variant="tertiary" type="button" onClick={() => setEditOpen(false)}>
                取消
              </CfButton>
              <CfButton type="submit">保存</CfButton>
            </div>
          </div>
        </CfForm>
      </CfDrawer>
    </div>
  );
}
