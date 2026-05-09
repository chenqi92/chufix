<script setup lang="ts">
import { CfStatusIllustration } from '@chufix/vue';
const variants = ['empty','search','upload','success','info','warning','error','not-found','forbidden','server-error'] as const;
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; align-items: center;">
    <div v-for="v in variants" :key="v" style="text-align: center;">
      <CfStatusIllustration :variant="v" />
      <div style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-3); margin-top: 4px;">{{ v }}</div>
    </div>
  </div>
</template>
