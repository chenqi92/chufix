<script setup lang="ts">
import { ref } from 'vue';
import { CfSpreadsheet } from '@chufix-design/vue';

const data = ref<Record<string, string>>({
  A1: '产品',
  B1: '区域',
  C1: '销量',
  A2: 'A',
  B2: '华北',
  C2: '120',
  A3: 'B',
  B3: '华东',
  C3: '230',
  A4: 'C',
  B4: '华南',
  C4: '180',
});

function updateData(next: Record<string, string>) {
  data.value = next;
}
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    单击选中、双击编辑、方向键移动、Tab/Enter 确认；Cmd/Ctrl + C / V 在选区与剪贴板间复制粘贴 TSV。
  </p>
  <CfSpreadsheet :model-value="data" :rows="10" :cols="5" @update:model-value="updateData" />
</template>
