<script setup lang="ts">
import { CfFab } from '@chufix-design/vue';

const plusPath = 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z';
</script>

<template>
  <div class="demo-scope">
    <p class="demo-hint">FAB 用 <code>position: fixed</code> 贴到视口角落。在 docs 里限定在演示区内观察。</p>
    <CfFab :aria-label="'新建'" position="bottom-right">
      <template #icon>
        <svg viewBox="0 0 24 24"><path :d="plusPath" fill="currentColor" /></svg>
      </template>
    </CfFab>
    <CfFab label="新建任务" extended position="bottom-center">
      <template #icon>
        <svg viewBox="0 0 24 24"><path :d="plusPath" fill="currentColor" /></svg>
      </template>
    </CfFab>
    <CfFab variant="secondary" :badge="3" position="bottom-left" aria-label="消息">
      <template #icon>
        <svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z" fill="currentColor" /></svg>
      </template>
    </CfFab>
  </div>
</template>

<style scoped>
.demo-scope {
  position: relative;
  min-height: 180px;
  background: var(--bg-1);
  border-radius: var(--r-6);
}
.demo-scope :deep(.cf-fab) { position: absolute; }
.demo-scope :deep(.cf-fab--bottom-right)  { right: 16px;  bottom: 16px; }
.demo-scope :deep(.cf-fab--bottom-left)   { left: 16px;   bottom: 16px; }
.demo-scope :deep(.cf-fab--bottom-center) { left: 50%; transform: translateX(-50%); bottom: 16px; }
</style>
