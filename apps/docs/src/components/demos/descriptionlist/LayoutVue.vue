<script setup lang="ts">
import { CfDescriptionList } from '@chufix/vue';

const items = [
  { term: '姓名', description: '张三' },
  { term: '邮箱', description: 'zhang@example.com' },
  { term: '部门', description: '研发' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">layout = horizontal（默认）</div>
      <CfDescriptionList :items="items" layout="horizontal" :term-width="80" bordered />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">layout = vertical</div>
      <CfDescriptionList :items="items" layout="vertical" bordered />
    </div>
  </div>
</template>
