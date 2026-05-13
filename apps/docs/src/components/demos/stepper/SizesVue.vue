<script setup lang="ts">
import { CfStepper, type StepItem } from '@chufix-design/vue';

const items: StepItem[] = [
  { title: '提交' },
  { title: '审核' },
  { title: '完成' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <span class="adm-tag">sm</span>
      <CfStepper :items="items" :current="1" size="sm" />
    </div>
    <div>
      <span class="adm-tag">md (默认)</span>
      <CfStepper :items="items" :current="1" size="md" />
    </div>
    <div>
      <span class="adm-tag">lg</span>
      <CfStepper :items="items" :current="1" size="lg" />
    </div>
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 20px; }
.adm-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--t-12);
  color: var(--fg-3);
  margin-bottom: 6px;
}
</style>
