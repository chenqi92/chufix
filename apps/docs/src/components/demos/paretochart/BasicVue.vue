<script setup lang="ts">
import { CfParetoChart, type ParetoItem } from '@chufix-design/vue';

const items: ParetoItem[] = [
  { label: '网络超时', value: 320 },
  { label: '认证失败', value: 248 },
  { label: '参数错误', value: 188 },
  { label: '服务限流', value: 142 },
  { label: '数据库锁', value: 96 },
  { label: '配置缺失', value: 64 },
  { label: '第三方故障', value: 42 },
  { label: '其他', value: 28 },
];
</script>

<template>
  <CfParetoChart :items="items" :format-value="(v: number) => v + ' 次'" />
</template>
