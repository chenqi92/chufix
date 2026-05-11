<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix-design/vue';

const options: SelectOption[] = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rs', label: 'Rust' },
  { value: 'py', label: 'Python' },
  { value: 'rb', label: 'Ruby' },
];

const value = ref<Array<string>>(['ts', 'go']);
</script>

<template>
  <CfSelect
    v-model="value"
    multiple
    clearable
    :options="options"
    placeholder="选一种或多种语言"
    style="max-width: 360px;"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    当前：{{ value.length ? value.join(' / ') : '空' }} · 用退格键删除最近的标签
  </p>
</template>
