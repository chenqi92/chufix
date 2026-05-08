<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix/vue';

const options: SelectOption[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
];

const city = ref<string | null>('shanghai');
</script>

<template>
  <div class="demo-stack">
    <CfSelect v-model="city" :options="options" placeholder="选一个城市" />
    <p class="demo-hint">已选：<code>{{ city ?? 'null' }}</code></p>
  </div>
</template>
