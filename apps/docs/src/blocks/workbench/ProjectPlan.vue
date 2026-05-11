<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
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
} from '@chufix-design/vue';

function iso(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const rows = reactive<GanttRow[]>([
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
]);

const dependencies = [
  { from: 'p1d', to: 'p1r' },
  { from: 'p1r', to: 'p2c' },
  { from: 'p2c', to: 'p2p' },
  { from: 'p2p', to: 'p3a' },
  { from: 'p3a', to: 'p4t' },
  { from: 'p4t', to: 'p4d' },
];

/* KPI summaries */
const totalBars = computed(() => rows.reduce((acc, r) => acc + r.bars.length, 0));
const totalDays = computed(() => {
  let min = Infinity;
  let max = -Infinity;
  for (const r of rows) {
    for (const b of r.bars) {
      const s = new Date(b.start as string).getTime();
      const e = new Date(b.end as string).getTime();
      if (s < min) min = s;
      if (e > max) max = e;
    }
  }
  return Math.round((max - min) / 86400000) + 1;
});
const completedRatio = computed(() => {
  let total = 0;
  let done = 0;
  for (const r of rows) {
    for (const b of r.bars) {
      total++;
      if ((b.progress ?? 0) >= 1) done++;
    }
  }
  return total ? Math.round((done / total) * 100) : 0;
});

/* Edit drawer state */
const editing = ref<{ bar: GanttBar; row: GanttRow } | null>(null);
const editOpen = ref(false);
const draft = reactive({ label: '', start: '', end: '' });

const editRules: Record<string, FieldRules> = {
  label: [{ required: true, min: 1, max: 32 }],
  start: [{ required: true }],
  end: [{ required: true }],
};

function openEdit(bar: GanttBar, row: GanttRow) {
  editing.value = { bar, row };
  draft.label = bar.label ?? '';
  draft.start = String(bar.start);
  draft.end = String(bar.end);
  editOpen.value = true;
}

async function saveEdit({ valid }: { valid: boolean }) {
  if (!valid || !editing.value) return;
  if (new Date(draft.end) < new Date(draft.start)) {
    toast({ type: 'error', message: '结束日期不能早于开始' });
    return;
  }
  const { bar, row } = editing.value;
  const target = row.bars.find((b) => b.id === bar.id);
  if (target) {
    target.label = draft.label;
    target.start = draft.start;
    target.end = draft.end;
  }
  editOpen.value = false;
  toast({ type: 'success', message: '已保存' });
}

async function deleteBar() {
  if (!editing.value) return;
  const ok = await modal.danger({
    title: '删除该任务条？',
    description: '该操作不可撤销。',
    okText: '删除',
  });
  if (!ok) return;
  const { bar, row } = editing.value;
  const idx = row.bars.findIndex((b) => b.id === bar.id);
  if (idx >= 0) row.bars.splice(idx, 1);
  editOpen.value = false;
  toast({ type: 'info', message: `已删除：${bar.label ?? bar.id}` });
}

function onBarChange(p: { bar: GanttBar; next: { start: Date; end: Date } }) {
  for (const row of rows) {
    const b = row.bars.find((x) => x.id === p.bar.id);
    if (b) {
      b.start = p.next.start.toISOString().slice(0, 10);
      b.end = p.next.end.toISOString().slice(0, 10);
    }
  }
}

async function exportPlan() {
  const ok = await drawer.confirm({
    title: '导出方案',
    description: '将当前甘特图序列化为 JSON，复制到剪贴板。',
    placement: 'right',
    size: 'sm',
    okText: '复制',
    content: '当前共 ' + totalBars.value + ' 个任务条，跨度 ' + totalDays.value + ' 天。',
  });
  if (!ok) return;
  await navigator.clipboard.writeText(JSON.stringify({ rows, dependencies }, null, 2));
  toast({ type: 'success', message: 'JSON 已复制' });
}
</script>

<template>
  <div class="project-plan">
    <header class="project-plan__head">
      <div>
        <h1 class="project-plan__title">v0.4 发布计划</h1>
        <p class="project-plan__subtitle">
          <CfTag tone="info" size="sm">progress</CfTag>
          截止 {{ iso(18) }}
        </p>
      </div>
      <CfButton @click="exportPlan">导出方案</CfButton>
    </header>

    <div class="project-plan__kpis">
      <CfMetricCard label="任务总数" :value="totalBars" hint="跨 4 个阶段" />
      <CfMetricCard label="跨度（天）" :value="totalDays" />
      <CfMetricCard label="完成度" :value="completedRatio" suffix="%" trend="up" />
      <CfMetricCard label="依赖关系" :value="dependencies.length" hint="from→to 配对" />
    </div>

    <CfTimelineGantt
      :rows="rows"
      :dependencies="dependencies"
      :start="iso(-10)"
      :end="iso(22)"
      :day-width="24"
      :row-height="38"
      editable
      @bar-click="openEdit"
      @bar-change="onBarChange"
    />

    <CfDrawer
      v-model:open="editOpen"
      placement="right"
      size="md"
      :title="`编辑：${editing?.bar.label ?? ''}`"
      description="任务条点击触发；改动写回 model。"
    >
      <CfForm
        layout="vertical"
        :model="draft"
        :rules="editRules"
        @submit="saveEdit"
      >
        <CfFormField name="label" label="任务名">
          <CfInput v-model="draft.label" />
        </CfFormField>
        <CfFormField name="start" label="开始日期">
          <CfInput v-model="draft.start" placeholder="YYYY-MM-DD" />
        </CfFormField>
        <CfFormField name="end" label="结束日期">
          <CfInput v-model="draft.end" placeholder="YYYY-MM-DD" />
        </CfFormField>
        <div style="display: flex; justify-content: space-between; gap: 8px;">
          <CfButton variant="danger" type="button" @click="deleteBar">删除</CfButton>
          <div style="display: flex; gap: 8px;">
            <CfButton variant="tertiary" type="button" @click="editOpen = false">取消</CfButton>
            <CfButton type="submit">保存</CfButton>
          </div>
        </div>
      </CfForm>
    </CfDrawer>
  </div>
</template>

<style scoped>
.project-plan {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--bg-1);
  font-family: var(--font-sans);
}
.project-plan__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.project-plan__title {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-semibold);
  color: var(--fg-1);
}
.project-plan__subtitle {
  margin: 4px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-12);
  color: var(--fg-3);
}
.project-plan__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 720px) {
  .project-plan__kpis { grid-template-columns: repeat(2, 1fr); }
}
</style>
