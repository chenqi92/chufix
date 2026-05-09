<script setup lang="ts">
import { CfDescriptionList } from '@chufix/vue';

const items = [
  { term: '版本', description: 'v0.0.1' },
  { term: '协议', description: 'MIT' },
  { term: '主作者', description: 'chenqi92' },
  { term: '依赖', description: '0' },
  { term: '组件数', description: '49+' },
  { term: '更新', description: '2026-05-09' },
];
</script>

<template>
  <CfDescriptionList :items="items" :columns="3" bordered :term-width="60" />
</template>
