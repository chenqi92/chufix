<script setup lang="ts">
import { ref } from 'vue';
import { CfCombobox, type ComboboxOption } from '@chufix/vue';

const value = ref<string | number | null>(null);
const options = ref<ComboboxOption[]>([
  { value: 'frontend', label: '前端' },
  { value: 'backend', label: '后端' },
  { value: 'devops', label: '运维' },
]);

function onCreate(v: string) {
  options.value.push({ value: v.toLowerCase(), label: v });
}
</script>

<template>
  <CfCombobox
    v-model="value"
    :options="options"
    allow-create
    clearable
    placeholder="选择或新增分类"
    @create="onCreate"
  />
</template>
