<script setup lang="ts">
import { CfSpeedDial } from '@chufix-design/vue';

const actions = [
  { key: 'note',  label: '记事',   iconPath: 'M4 2h12v20H4z M7 6h6M7 10h6M7 14h4' },
  { key: 'photo', label: '拍照',   iconPath: 'M3 6h4l2-2h6l2 2h4v12H3z M12 16a4 4 0 100-8 4 4 0 000 8z' },
  { key: 'mic',   label: '语音',   iconPath: 'M12 2a3 3 0 013 3v6a3 3 0 11-6 0V5a3 3 0 013-3z M5 11a7 7 0 0014 0 M12 18v3' },
];

function onAction(key: string) {
  console.log('SpeedDial action', key);
}
</script>

<template>
  <div class="demo-scope">
    <CfSpeedDial :actions="actions" @action="onAction" />
    <p class="demo-hint">点击右下角 + 展开三个子操作（这里 fixed 在 demo 区域内）。</p>
  </div>
</template>

<style scoped>
.demo-scope {
  position: relative;
  min-height: 240px;
  background: var(--bg-1);
  border-radius: var(--r-6);
}
.demo-scope :deep(.cf-speeddial) { position: absolute; right: 16px; bottom: 16px; }
.demo-hint { padding: 12px 16px 0; color: var(--fg-3); }
</style>
