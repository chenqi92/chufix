<script setup lang="ts">
import { CfStatusIllustration } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 24px;">
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="sm" />
    </div>
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="md" />
    </div>
    <div class="status-size-demo">
      <CfStatusIllustration variant="empty" size="lg" />
    </div>
  </div>
</template>

<style scoped>
.status-size-demo {
  min-width: 116px;
  display: grid;
  place-items: center;
}
</style>
