<script setup lang="ts">
import { CfCard } from '@chufix/vue';
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; width: 100%;">
    <CfCard variant="outlined">
      <strong>outlined</strong>
      <p class="demo-hint" style="margin: 0.4rem 0 0;">默认描边卡片</p>
    </CfCard>
    <CfCard variant="elevated">
      <strong>elevated</strong>
      <p class="demo-hint" style="margin: 0.4rem 0 0;">带阴影抬升</p>
    </CfCard>
    <CfCard variant="filled">
      <strong>filled</strong>
      <p class="demo-hint" style="margin: 0.4rem 0 0;">浅灰填充背景</p>
    </CfCard>
  </div>
</template>
