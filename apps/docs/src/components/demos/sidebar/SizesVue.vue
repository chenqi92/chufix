<script setup lang="ts">
import { ref } from 'vue';
import { CfSidebar, type SidebarEntry } from '@chufix/vue';

const a = ref('overview');
const b = ref('overview');
const c = ref('overview');

const items: SidebarEntry[] = [
  { key: 'overview', label: '概览' },
  { key: 'analytics', label: '分析' },
  { key: 'reports', label: '报表' },
  { key: 'settings', label: '设置' },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <CfSidebar v-model="a" :items="items" size="sm" />
    <CfSidebar v-model="b" :items="items" size="md" />
    <CfSidebar v-model="c" :items="items" size="lg" />
  </div>
</template>
