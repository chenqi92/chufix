<script setup lang="ts">
import { CfStatusIllustration } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 24px;">
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="sm" />
      <div>size = sm</div>
    </div>
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="md" />
      <div>size = md</div>
    </div>
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="lg" />
      <div>size = lg</div>
    </div>
  </div>
</template>

<style scoped>
.status-size-demo {
  min-width: 116px;
  display: grid;
  place-items: center;
  gap: 8px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
}
</style>
