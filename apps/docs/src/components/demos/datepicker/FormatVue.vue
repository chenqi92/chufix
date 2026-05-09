<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix/vue';

const a = ref<string | null>('2026-05-09');
const b = ref<string | null>('2026-05-09');
const c = ref<string | null>('2026-05-09');
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; max-width: 320px;">
    <CfDatePicker v-model="a" format="YYYY-MM-DD" />
    <CfDatePicker v-model="b" format="YYYY 年 M 月 D 日" />
    <CfDatePicker v-model="c" format="DD/MM/YYYY" />
  </div>
</template>
