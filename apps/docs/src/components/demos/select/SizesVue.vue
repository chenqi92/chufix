<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect } from '@chufix-design/vue';

const options = [
  { label: '上海', value: 'sh' },
  { label: '北京', value: 'bj' },
  { label: '深圳', value: 'sz' },
];
const sm = ref<string>('sh');
const md = ref<string>('sh');
const lg = ref<string>('sh');
</script>

<template>
  <div class="demo-stack">
    <CfSelect v-model="sm" :options="options" size="sm" placeholder="size = sm" />
    <CfSelect v-model="md" :options="options" size="md" placeholder="size = md" />
    <CfSelect v-model="lg" :options="options" size="lg" placeholder="size = lg" />
  </div>
</template>
