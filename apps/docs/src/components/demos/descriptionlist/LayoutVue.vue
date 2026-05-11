<script setup lang="ts">
import { CfDescriptionList } from '@chufix-design/vue';

const items = [
  { term: '姓名', description: '张三' },
  { term: '邮箱', description: 'zhang@example.com' },
  { term: '部门', description: '研发' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfDescriptionList :items="items" layout="horizontal" :term-width="80" bordered />
    </div>
    <div>
      <CfDescriptionList :items="items" layout="vertical" bordered />
    </div>
  </div>
</template>
