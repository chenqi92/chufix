<script setup lang="ts">
import { CfRating } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">readonly · 显示评分但不可改</div>
      <CfRating :model-value="4" readonly show-value />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">disabled · 灰显且不响应</div>
      <CfRating :model-value="2" disabled />
    </div>
  </div>
</template>
