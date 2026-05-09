<script setup lang="ts">
import { ref } from 'vue';
import { CfDetachedPanel, CfButton } from '@chufix/vue';
const a = ref(false);
const b = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton @click="a = true">面板 A</CfButton>
    <CfButton variant="secondary" @click="b = true">面板 B（resizable）</CfButton>
    <CfDetachedPanel
      v-model:open="a"
      title="Inspector A"
      :width="280"
      :height="180"
      :z-index="1500"
    >
      <div style="font-size: 12px; color: var(--fg-2);">头部拖动可移动整个面板。</div>
    </CfDetachedPanel>
    <CfDetachedPanel
      v-model:open="b"
      title="Inspector B"
      :width="320"
      :height="220"
      resizable
      :z-index="1501"
    >
      <div style="font-size: 12px; color: var(--fg-2);">右下角可拖拽改变大小（resizable）。</div>
    </CfDetachedPanel>
  </div>
</template>
