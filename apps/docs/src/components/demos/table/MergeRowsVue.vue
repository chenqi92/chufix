<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Build { project: string; branch: string; step: string; status: string; duration: string; }

const rows = ref<Build[]>([
  { project: 'web', branch: 'main', step: '安装依赖', status: 'OK', duration: '8s' },
  { project: 'web', branch: 'main', step: '类型检查', status: 'OK', duration: '11s' },
  { project: 'web', branch: 'main', step: '单测', status: 'OK', duration: '24s' },
  { project: 'web', branch: 'feat/login', step: '安装依赖', status: 'OK', duration: '8s' },
  { project: 'web', branch: 'feat/login', step: '单测', status: 'FAIL', duration: '6s' },
  { project: 'api', branch: 'main', step: '编译', status: 'OK', duration: '14s' },
  { project: 'api', branch: 'main', step: '集成测试', status: 'OK', duration: '38s' },
]);

const columns: TableColumn<Build>[] = [
  { key: 'project', title: '项目', width: 100, mergeRows: true },
  { key: 'branch', title: '分支', width: 160, mergeRows: true },
  { key: 'step', title: '步骤', width: 140 },
  { key: 'status', title: '状态', width: 90, align: 'center' },
  { key: 'duration', title: '耗时', width: 90, align: 'right' },
];
</script>

<template>
  <CfTable :columns="columns" :rows="rows" variant="bordered" />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    项目 + 分支两列开了 <code>mergeRows: true</code>，连续相同值自动合并 rowSpan。
  </p>
</template>
