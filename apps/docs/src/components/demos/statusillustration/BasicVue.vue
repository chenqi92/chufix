<script setup lang="ts">
import { CfStatusIllustration } from '@chufix-design/vue';
const variants = ['empty','search','upload','success','info','warning','error','not-found','forbidden','server-error'] as const;
</script>

<template>
  <div class="status-illustration-demo">
    <div v-for="v in variants" :key="v" class="status-illustration-demo__item">
      <CfStatusIllustration :variant="v" />
      <div class="status-illustration-demo__label">{{ v }}</div>
    </div>
  </div>
</template>

<style scoped>
.status-illustration-demo {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 12px;
}

.status-illustration-demo__item {
  min-height: 124px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  padding: 14px 10px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-5);
  background: color-mix(in oklch, var(--bg-1), transparent 8%);
}

.status-illustration-demo__label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
  text-align: center;
}
</style>
