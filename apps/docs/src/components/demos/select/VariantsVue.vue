<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix/vue';

const options: SelectOption[] = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
];

const v1 = ref<string | null>('a');
const v2 = ref<string | null>('b');
const v3 = ref<string | null>('c');
</script>

<template>
  <div class="demo-stack">
    <CfSelect v-model="v1" :options="options" variant="outline" />
    <CfSelect v-model="v2" :options="options" variant="filled" />
    <CfSelect v-model="v3" :options="options" variant="ghost" />
  </div>
</template>
