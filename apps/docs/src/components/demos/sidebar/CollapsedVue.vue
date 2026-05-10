<script setup lang="ts">
import { ref } from 'vue';
import { CfSidebar, CfButton, type SidebarEntry } from '@chufix-design/vue';

const active = ref('overview');
const collapsed = ref(true);
const homeIcon = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 7l5-4 5 4v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="currentColor" stroke-width="1.4"/></svg>';
const chartIcon = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 13V8m4 5V5m4 8V9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const usersIcon = '<svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M2 13a4 4 0 0 1 8 0M11 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM10.5 13a3 3 0 0 1 4-2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const cogIcon = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8 3.4 3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

const items: SidebarEntry[] = [
  { key: 'overview', label: '概览', icon: homeIcon },
  { key: 'analytics', label: '分析', icon: chartIcon, badge: '12' },
  { key: 'team', label: '团队', icon: usersIcon },
  { key: 'settings', label: '设置', icon: cogIcon },
];
</script>

<template>
  <div style="display:flex; gap: 12px; align-items: flex-start;">
    <CfButton size="sm" variant="tertiary" @click="collapsed = !collapsed">
      {{ collapsed ? '展开' : '收起' }}
    </CfButton>
    <div style="border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
      <CfSidebar v-model="active" :items="items" :collapsed="collapsed" />
    </div>
  </div>
</template>
