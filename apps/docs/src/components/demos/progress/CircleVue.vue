<script setup lang="ts">
import { CfProgress } from '@chufix/vue';
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <CfProgress variant="circle" size="sm" :value="40" show-label />
    <CfProgress variant="circle" :value="60" show-label />
    <CfProgress variant="circle" size="lg" :value="100" tone="success" show-label />
    <CfProgress variant="circle" size="lg" indeterminate />
  </div>
</template>
