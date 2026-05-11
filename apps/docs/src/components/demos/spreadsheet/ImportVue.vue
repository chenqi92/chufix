<script setup lang="ts">
import { ref } from 'vue';
import { CfSpreadsheet, CfButton, toast, rangeToTSV } from '@chufix-design/vue';

const data = ref<Record<string, string>>({});

function updateData(next: Record<string, string>) {
  data.value = next;
}

function loadSample() {
  data.value = {
    A1: 'date', B1: 'cpu', C1: 'mem',
    A2: '2026-05-01', B2: '0.42', C2: '0.61',
    A3: '2026-05-02', B3: '0.51', C3: '0.65',
    A4: '2026-05-03', B4: '0.66', C4: '0.72',
    A5: '2026-05-04', B5: '0.49', C5: '0.69',
    A6: '2026-05-05', B6: '0.58', C6: '0.71',
  };
}

async function exportAll() {
  const tsv = rangeToTSV(data.value, {
    start: { col: 0, row: 0 },
    end: { col: 4, row: 9 },
  });
  await navigator.clipboard.writeText(tsv);
  toast({ type: 'success', message: 'TSV 已复制到剪贴板' });
}
</script>

<template>
  <div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <CfButton size="sm" @click="loadSample">载入样例数据</CfButton>
    <CfButton size="sm" variant="tertiary" @click="exportAll">导出全部为 TSV</CfButton>
  </div>
  <CfSpreadsheet :model-value="data" :rows="10" :cols="5" :col-width="140" @update:model-value="updateData" />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    试试：在 Excel / Numbers / Sheets 选一段复制，到这里 Cmd/Ctrl+V 粘贴；反向 Cmd/Ctrl+C 也能拷出去。
  </p>
</template>
