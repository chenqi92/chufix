<script setup lang="ts">
import { CfStepper, type StepItem } from '@chufix-design/vue';

const items: StepItem[] = [
  { title: '提交申请', description: '已于 2026-05-01 提交', status: 'done' },
  { title: '审核中', description: '客户经理预计 2 天内回复', status: 'current' },
  { title: '签订合同', description: '电子签或邮寄都可' },
  { title: '账户激活', status: 'error' },
];
</script>

<template>
  <CfStepper :items="items" orientation="vertical" />
</template>
