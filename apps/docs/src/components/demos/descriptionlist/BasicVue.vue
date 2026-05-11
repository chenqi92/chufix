<script setup lang="ts">
import { CfDescriptionList } from '@chufix-design/vue';

const items = [
  { term: '订单号', description: '#2026-CF-00018' },
  { term: '下单时间', description: '2026-05-09 14:23' },
  { term: '联系人', description: '陈先生' },
  { term: '电话', description: '138-0000-0000' },
  { term: '配送地址', description: '上海市浦东新区世纪大道 100 号 18A 室' },
];
</script>

<template>
  <CfDescriptionList :items="items" :term-width="100" bordered title="订单信息" />
</template>
