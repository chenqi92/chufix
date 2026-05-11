<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  CfButton,
  CfMetricCard,
  CfSpreadsheet,
  CfTag,
  modal,
  rangeToTSV,
  toA1,
  toast,
} from '@chufix-design/vue';

interface RowError { row: number; col: string; message: string; }

const HEADERS = ['name', 'email', 'role', 'amount'];
const COLS = HEADERS.length;
const ROWS = 12;

function seed(): Record<string, string> {
  const out: Record<string, string> = {};
  HEADERS.forEach((h, c) => { out[toA1(c, 0)] = h; });
  const sample = [
    ['Alice', 'alice@example.com', 'admin', '120'],
    ['Bob', 'bob@example.com', 'user', '88'],
    ['Charlie', 'charlie@', 'user', '60'],
    ['Dora', '', 'guest', '20'],
    ['', 'eli@example.com', 'user', '-5'],
  ];
  sample.forEach((row, r) => {
    row.forEach((cell, c) => {
      out[toA1(c, r + 1)] = cell;
    });
  });
  return out;
}

const data = reactive<Record<string, string>>(seed());

interface ParsedRow { name: string; email: string; role: string; amount: string; rowIndex: number; }

const rows = computed<ParsedRow[]>(() => {
  const out: ParsedRow[] = [];
  for (let r = 1; r < ROWS; r++) {
    const obj: Record<string, string> = {};
    let any = false;
    HEADERS.forEach((h, c) => {
      const v = data[toA1(c, r)] ?? '';
      obj[h] = v;
      if (v.trim()) any = true;
    });
    if (any) {
      out.push({
        name: obj.name ?? '',
        email: obj.email ?? '',
        role: obj.role ?? '',
        amount: obj.amount ?? '',
        rowIndex: r + 1,
      });
    }
  }
  return out;
});

const ROLE_VALUES = new Set(['admin', 'user', 'guest']);
const errors = computed<RowError[]>(() => {
  const out: RowError[] = [];
  for (const r of rows.value) {
    if (!r.name.trim()) out.push({ row: r.rowIndex, col: 'name', message: '姓名不能为空' });
    if (!r.email.trim()) out.push({ row: r.rowIndex, col: 'email', message: '邮箱不能为空' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())) out.push({ row: r.rowIndex, col: 'email', message: '邮箱格式不正确' });
    if (r.role && !ROLE_VALUES.has(r.role)) out.push({ row: r.rowIndex, col: 'role', message: `角色必须是 ${[...ROLE_VALUES].join('/')}` });
    const n = Number(r.amount);
    if (Number.isNaN(n) || n < 0) out.push({ row: r.rowIndex, col: 'amount', message: '金额必须是非负数' });
  }
  return out;
});

const validCount = computed(() => {
  const errored = new Set(errors.value.map((e) => e.row));
  return rows.value.filter((r) => !errored.has(r.rowIndex)).length;
});

async function importAll() {
  if (errors.value.length) {
    toast({ type: 'error', message: `仍有 ${errors.value.length} 条错误，请先修复` });
    return;
  }
  const ok = await modal.confirm({
    title: `导入 ${rows.value.length} 行？`,
    description: '将作为一次提交写入用户表。',
    okText: '导入',
  });
  if (!ok) return;
  toast({ type: 'success', message: `已导入 ${rows.value.length} 行` });
}

async function exportTemplate() {
  const tsv = rangeToTSV(data, {
    start: { col: 0, row: 0 },
    end: { col: COLS - 1, row: 0 },
  });
  await navigator.clipboard.writeText(tsv);
  toast({ type: 'info', message: '表头已复制到剪贴板，可粘贴到 Excel/Sheets' });
}

function clearAll() {
  for (const k of Object.keys(data)) delete data[k];
  HEADERS.forEach((h, c) => { data[toA1(c, 0)] = h; });
  toast({ type: 'info', message: '已清空数据（保留表头）' });
}
</script>

<template>
  <div class="bi">
    <header class="bi__head">
      <div>
        <h1 class="bi__title">批量导入用户</h1>
        <p class="bi__sub">
          <CfTag :tone="errors.length ? 'error' : 'success'" size="sm">
            {{ errors.length ? `${errors.length} 处错误` : 'ready' }}
          </CfTag>
          支持从 Excel / Sheets 直接 Cmd+V 粘贴
        </p>
      </div>
      <div class="bi__actions">
        <CfButton variant="tertiary" @click="exportTemplate">复制表头</CfButton>
        <CfButton variant="tertiary" @click="clearAll">清空</CfButton>
        <CfButton :disabled="!rows.length || !!errors.length" @click="importAll">
          导入 {{ rows.length }} 行
        </CfButton>
      </div>
    </header>

    <div class="bi__kpis">
      <CfMetricCard label="待导入" :value="rows.length" />
      <CfMetricCard label="可通过" :value="validCount" trend="up" />
      <CfMetricCard label="错误" :value="errors.length" :trend="errors.length ? 'down' : undefined" />
    </div>

    <CfSpreadsheet
      v-model="data"
      :rows="ROWS"
      :cols="COLS"
      :col-width="160"
      caption="第一行是表头,从第二行起填数据"
    />

    <div v-if="errors.length" class="bi__errors">
      <h2 class="bi__errors-title">校验报告</h2>
      <ul class="bi__errors-list">
        <li v-for="(e, i) in errors" :key="i">
          第 {{ e.row }} 行 · <code>{{ e.col }}</code> — {{ e.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.bi {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--bg-1);
  font-family: var(--font-sans);
}
.bi__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.bi__title {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-semibold);
  color: var(--fg-1);
}
.bi__sub {
  margin: 4px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-12);
  color: var(--fg-3);
}
.bi__actions { display: flex; gap: 8px; flex-wrap: wrap; }
.bi__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 600px) { .bi__kpis { grid-template-columns: 1fr; } }
.bi__errors {
  padding: 12px 14px;
  border: 1px solid var(--status-error-soft);
  background: color-mix(in oklch, var(--status-error) 5%, var(--bg-1));
  border-radius: 6px;
}
.bi__errors-title {
  margin: 0 0 8px;
  font-size: var(--t-13);
  font-weight: var(--w-semibold);
  color: var(--status-error);
}
.bi__errors-list {
  margin: 0;
  padding-left: 18px;
  font-size: var(--t-12);
  color: var(--fg-2);
  display: grid;
  gap: 4px;
}
.bi__errors-list code {
  background: var(--bg-2);
  padding: 0 4px;
  border-radius: 2px;
  font-family: var(--font-mono);
}
</style>
