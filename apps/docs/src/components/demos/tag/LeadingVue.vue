<script setup lang="ts">
import { CfTag } from '@chufix-design/vue';
</script>

<template>
  <CfTag tone="success">
    <template #leading>
      <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 8.5l3 3L13 5" />
      </svg>
    </template>
    已发布
  </CfTag>

  <CfTag tone="warning">
    <template #leading>
      <span class="adm-dot" />
    </template>
    草稿
  </CfTag>

  <CfTag tone="neutral">
    <template #leading>
      <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="2" y="3" width="12" height="10" rx="1" />
        <path d="M6 7h4M6 10h4" />
      </svg>
    </template>
    已归档
  </CfTag>

  <CfTag tone="info" variant="outline">
    <template #leading>
      <span class="adm-pulse" />
    </template>
    Beta
  </CfTag>
</template>

<style scoped>
.adm-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
  display: inline-block;
}
.adm-pulse {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
  display: inline-block;
  box-shadow: 0 0 0 0 currentColor;
  animation: adm-pulse 1.4s ease-out infinite;
}
@keyframes adm-pulse {
  0%   { box-shadow: 0 0 0 0   color-mix(in srgb, currentColor 60%, transparent); }
  100% { box-shadow: 0 0 0 6px color-mix(in srgb, currentColor 0%,  transparent); }
}
</style>
