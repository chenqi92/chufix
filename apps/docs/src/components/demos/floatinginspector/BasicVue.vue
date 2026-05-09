<script setup lang="ts">
import { ref } from 'vue';
import { CfFloatingInspector, CfButton } from '@chufix/vue';
const open = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = !open">{{ open ? '关闭' : '打开' }} 检查器</CfButton>
    <CfFloatingInspector
      :open="open"
      placement="bottom-right"
      title="Inspector"
      @update:open="(v) => open = v"
    >
      <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: var(--fg-2);">
        <li>FPS: 60</li>
        <li>Render: 4.2ms</li>
        <li>Paint: 1.8ms</li>
        <li>Layout: 0.4ms</li>
      </ul>
    </CfFloatingInspector>
  </div>
</template>
