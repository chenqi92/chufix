<script setup lang="ts">
import { ref } from 'vue';
import { CfDetachedPanel, CfButton } from '@chufix-design/vue';
const open = ref(false);
const host = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="host" class="demo-floating-host demo-floating-host--panel">
    <div class="demo-row">
      <CfButton @click="open = true">弹出浮动面板</CfButton>
    </div>
    <CfDetachedPanel
      v-model:open="open"
      title="Inspector"
      :to="host ?? 'body'"
      :x="24"
      :y="64"
      :width="320"
      :height="220"
    >
      <div style="font-size: 13px; color: var(--fg-2); line-height: 1.6;">
        拖动顶部把手可以移动面板。<br>
        外部 Tauri/Electron 应用可在 tear-off 事件里把它转换成独立窗口。
      </div>
    </CfDetachedPanel>
  </div>
</template>
