<script setup lang="ts">
import { CfGrid, CfTag } from '@chufix-design/vue';

const cards = [
  ['API Gateway', '99.98%', 'success'],
  ['Worker Queue', '1.2k/min', 'info'],
  ['D1 Storage', '42 ms', 'warning'],
  ['Edge Cache', '84%', 'success'],
] as const;
</script>

<template>
  <CfGrid :min-item-width="180" gap="md" style="width: 100%; max-width: 760px;">
    <article v-for="[name, value, tone] in cards" :key="name" class="demo-card">
      <CfTag :tone="tone">{{ name }}</CfTag>
      <strong>{{ value }}</strong>
      <span>实时观测指标</span>
    </article>
  </CfGrid>
</template>

<style scoped>
.demo-card {
  min-height: 132px;
  border: 1px solid var(--line-1);
  border-radius: 8px;
  padding: 16px;
  background: var(--surface-1);
  display: grid;
  gap: 12px;
  align-content: start;
}

.demo-card strong {
  font-size: 28px;
  line-height: 1;
  color: var(--fg-1);
}

.demo-card span {
  color: var(--fg-2);
}
</style>
