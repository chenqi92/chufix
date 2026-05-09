<script setup lang="ts">
import { CfSpinner } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <CfSpinner label="正在加载…" />
    <CfSpinner size="lg" tone="success" label="保存中" />
  </div>
</template>
