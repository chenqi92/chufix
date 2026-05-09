<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix/vue';

const a = ref<number | null>(42);
const b = ref<number | null>(42);
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">默认（带 +/− 按钮）</div>
      <CfNumberInput v-model="a" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">hideSteppers</div>
      <CfNumberInput v-model="b" hide-steppers />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">disabled</div>
      <CfNumberInput :model-value="42" disabled />
    </div>
  </div>
</template>
