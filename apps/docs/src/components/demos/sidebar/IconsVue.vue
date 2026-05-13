<script setup lang="ts">
import { ref } from 'vue';
import { CfSidebar, type SidebarEntry } from '@chufix-design/vue';

const active = ref<string>('dashboard');

const SVG = {
  dashboard: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="5" height="6" rx="1"/><rect x="9" y="2" width="5" height="4" rx="1"/><rect x="2" y="10" width="5" height="4" rx="1"/><rect x="9" y="8" width="5" height="6" rx="1"/></svg>',
  inbox: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l2-5h8l2 5v5H2z"/><path d="M2 8h3l1 2h4l1-2h3"/></svg>',
  team: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><path d="M2 14c0-2.5 2-4 4-4s4 1.5 4 4"/><circle cx="12" cy="5" r="1.6"/><path d="M10.5 13c0-1.8 1-2.8 2.5-2.8s2.5 1 2.5 2.8"/></svg>',
  settings: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/></svg>',
};

const items: SidebarEntry[] = [
  { key: 'dashboard', label: '工作台', icon: SVG.dashboard },
  { key: 'inbox', label: '收件箱', icon: SVG.inbox, badge: 5 },
  { key: 'team', label: '团队', icon: SVG.team },
  { key: 'settings', label: '设置', icon: SVG.settings },
];
</script>

<template>
  <CfSidebar v-model="active" :items="items" />
</template>
