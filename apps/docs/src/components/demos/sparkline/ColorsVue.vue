<script setup lang="ts">
import { CfSparkline } from '@chufix-design/vue';
const data = Array.from({ length: 14 }, (_, i) => Number((6 + Math.sin(i / 2) * 4 + Math.cos(i / 3) * 1.4).toFixed(3)));
const labels = ['indigo', 'amber', 'green', 'red', 'cyan', 'magenta', 'lime', 'azure'];
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px;">
    <span v-for="(label, i) in labels" :key="i" style="display: inline-flex; align-items: center; gap: 8px;">
      <CfSparkline :data="data" :color-index="i" filled smooth :width="100" :height="22" />
      <span style="font-size: 12px; color: var(--fg-3); font-family: var(--font-mono);">--viz-{{ i + 1 }} · {{ label }}</span>
    </span>
  </div>
</template>
