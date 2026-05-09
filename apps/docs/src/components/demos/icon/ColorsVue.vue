<script setup lang="ts">
import { CfIcon } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <CfIcon name="check-circle" color="var(--status-success)" size="lg" />
    <CfIcon name="alert-triangle" color="var(--status-warning)" size="lg" />
    <CfIcon name="x-circle" color="var(--status-error)" size="lg" />
    <CfIcon name="info" color="var(--status-info)" size="lg" />
    <CfIcon name="star" color="var(--accent-1)" size="lg" />
    <span style="color: var(--accent-1);">
      <CfIcon name="zap" size="lg" />
      继承父级颜色
    </span>
  </div>
</template>
