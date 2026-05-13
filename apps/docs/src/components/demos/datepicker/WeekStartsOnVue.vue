<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix-design/vue';

const a = ref<string | null>('2026-05-09');
const b = ref<string | null>('2026-05-09');
</script>

<template>
  <div class="demo-row">
    <div>
      <span class="adm-label">weekStartsOn = 1（周一开头，默认）</span>
      <CfDatePicker v-model="a" :week-starts-on="1" />
    </div>
    <div>
      <span class="adm-label">weekStartsOn = 0（周日开头）</span>
      <CfDatePicker v-model="b" :week-starts-on="0" />
    </div>
  </div>
</template>

<style scoped>
.adm-label { display: block; color: var(--fg-3); font-size: var(--t-12); margin-bottom: 6px; }
</style>
