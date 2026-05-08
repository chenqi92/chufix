<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix/vue';

const options: SelectOption[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'chengdu', label: '成都（暂不可选）', disabled: true },
];

const a = ref<string | null>('shanghai');
const b = ref<string | null>(null);
</script>

<template>
  <div class="demo-stack">
    <CfSelect v-model="a" :options="options" placeholder="可清空（输入后出现 ×）" clearable />
    <CfSelect v-model="b" :options="options" placeholder="禁用" disabled />
    <CfSelect v-model="b" :options="options" placeholder="错误状态" error />
  </div>
</template>
