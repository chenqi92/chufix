<script setup lang="ts">
import { CfSpinner } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="gap: 1.5rem; align-items: center;">
      <CfSpinner size="sm" />
      <CfSpinner size="md" />
      <CfSpinner size="lg" />
    </div>
    <div class="demo-row" style="gap: 1.5rem; align-items: center;">
      <CfSpinner tone="primary" />
      <CfSpinner tone="success" />
      <CfSpinner tone="warning" />
      <CfSpinner tone="danger" />
      <CfSpinner tone="info" />
      <CfSpinner tone="neutral" />
    </div>
    <CfSpinner label="正在加载…" />
  </div>
</template>
