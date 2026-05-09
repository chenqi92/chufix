<script setup lang="ts">
import { CfDescriptionList } from '@chufix/vue';

const items = [
  { term: '总览', description: '在线 124 / 离线 8' },
  { term: '更新时间', description: '2026-05-09 16:00' },
];
</script>

<template>
  <div class="demo-stack">
    <CfDescriptionList :items="items" size="sm" bordered title="size = sm" />
    <CfDescriptionList :items="items" size="md" bordered title="size = md" />
    <CfDescriptionList :items="items" size="lg" bordered title="size = lg" />
  </div>
</template>
