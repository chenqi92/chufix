<script setup lang="ts">
import { ref } from 'vue';
import { CfFloatingInspector, CfButton } from '@chufix/vue';
import type { InspectorPlacement } from '@chufix/vue';
const open = ref(true);
const placement = ref<InspectorPlacement>('bottom-right');
const placements: InspectorPlacement[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
</script>

<template>
  <div class="demo-row" style="flex-wrap: wrap;">
    <CfButton v-for="p in placements" :key="p" size="sm" @click="placement = p; open = true">{{ p }}</CfButton>
    <CfButton variant="tertiary" size="sm" @click="open = false">关闭</CfButton>
    <CfFloatingInspector
      :open="open"
      :placement="placement"
      :title="placement"
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
