<script setup lang="ts">
import { ref } from 'vue';
import { Select, type SelectOption } from '@chukit/vue';

const options: SelectOption[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'chengdu', label: '成都（暂不可选）', disabled: true },
];

const city = ref<string | null>('shanghai');
const empty = ref<string | null>(null);
</script>

<template>
  <div class="demo-stack">
    <Select v-model="city" :options="options" placeholder="选一个城市" clearable />
    <p class="demo-hint">已选：<code>{{ city ?? 'null' }}</code></p>

    <div class="demo-row">
      <Select v-model="empty" :options="options" size="sm" placeholder="sm" />
      <Select v-model="empty" :options="options" size="lg" placeholder="lg" />
      <Select :options="options" placeholder="禁用" disabled />
    </div>
  </div>
</template>
