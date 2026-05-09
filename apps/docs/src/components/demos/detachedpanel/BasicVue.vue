<script setup lang="ts">
import { ref } from 'vue';
import { CfDetachedPanel, CfButton } from '@chufix/vue';
const open = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">弹出浮动面板</CfButton>
    <CfDetachedPanel v-model:open="open" title="Inspector" :width="320" :height="220">
      <div style="font-size: 13px; color: var(--fg-2); line-height: 1.6;">
        拖动顶部把手可以移动面板。<br>
        外部 Tauri/Electron 应用可在 tear-off 事件里把它转换成独立窗口。
      </div>
    </CfDetachedPanel>
  </div>
</template>
