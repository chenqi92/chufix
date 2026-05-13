<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix-design/vue';

const a = ref<string | null>('2026-05-09');
const b = ref<string | null>('2026-05-09');
const c = ref<string | null>('2026-05-09');
const d = ref<string | null>(null);
</script>

<template>
  <div class="demo-row">
    <CfDatePicker v-model="a" variant="outline" clearable />
    <CfDatePicker v-model="b" variant="filled" clearable />
    <CfDatePicker v-model="c" variant="ghost" clearable />
    <CfDatePicker v-model="d" variant="outline" error placeholder="错误态" />
  </div>
</template>
