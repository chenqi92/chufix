<script setup lang="ts">
import { CfStatusIllustration } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 24px;">
    <div style="text-align: center;">
      <CfStatusIllustration variant="empty" size="sm" />
      <div style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-3); margin-top: 4px;">size = sm</div>
    </div>
    <div style="text-align: center;">
      <CfStatusIllustration variant="empty" size="md" />
      <div style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-3); margin-top: 4px;">size = md</div>
    </div>
    <div style="text-align: center;">
      <CfStatusIllustration variant="empty" size="lg" />
      <div style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-3); margin-top: 4px;">size = lg</div>
    </div>
  </div>
</template>
