<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeSelect, type TreeSelectNode } from '@chufix-design/vue';

const value = ref<string[]>(['edge-workers', 'storage-r2']);
const options: TreeSelectNode[] = [
  {
    value: 'platform',
    label: '平台能力',
    children: [
      { value: 'edge-workers', label: 'Workers' },
      { value: 'storage-d1', label: 'D1 数据库' },
      { value: 'storage-r2', label: 'R2 存储' },
      { value: 'storage-kv', label: 'KV 存储' },
    ],
  },
  {
    value: 'product',
    label: '产品体验',
    children: [
      { value: 'docs', label: '文档站' },
      { value: 'dashboard', label: '控制台' },
      { value: 'billing', label: '计费中心', disabled: true },
    ],
  },
];
</script>

<template>
  <div class="demo-stack">
    <CfTreeSelect
      v-model="value"
      :options="options"
      multiple
      searchable
      clearable
      :default-expanded-keys="['platform']"
    />
    <p class="demo-hint">
      已选 <code>{{ value.length }}</code> 项 — 点父节点会级联选中所有可用子节点。
    </p>
  </div>
</template>
