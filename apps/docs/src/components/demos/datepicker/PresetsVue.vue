<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker, type DatePickerPreset } from '@chufix-design/vue';

const value = ref<string | null>(null);

const presets: DatePickerPreset[] = [
  { label: '今天', value: () => new Date() },
  {
    label: '昨天',
    value: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    },
  },
  {
    label: '7 天前',
    value: () => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d;
    },
  },
  {
    label: '本月 1 号',
    value: () => {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), 1);
    },
  },
  {
    label: '上月 1 号',
    value: () => {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    },
  },
];
</script>

<template>
  <CfDatePicker v-model="value" clearable :presets="presets" />
</template>
