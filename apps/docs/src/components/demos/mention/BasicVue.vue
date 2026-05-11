<script setup lang="ts">
import { ref } from 'vue';
import { CfMention } from '@chufix-design/vue';

const text = ref('在评论里输入 @ 试试');
const options = [
  { value: 'alice', label: 'Alice 张', description: '前端 · 设计系统' },
  { value: 'bob', label: 'Bob 李', description: '后端 · API 网关' },
  { value: 'carol', label: 'Carol 刘', description: '产品' },
  { value: 'david', label: 'David 王', description: 'QA' },
  { value: 'eve', label: 'Eve 周', description: '运维', disabled: true },
];
</script>

<template>
  <CfMention
    v-model="text"
    :options="options"
    placeholder="输入 @ 触发提及"
  />
</template>
