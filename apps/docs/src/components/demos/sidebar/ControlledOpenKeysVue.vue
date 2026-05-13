<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfSidebar, type SidebarEntry } from '@chufix-design/vue';

const active = ref<string>('members');
const openKeys = ref<string[]>(['team']);

const items: SidebarEntry[] = [
  {
    key: 'team',
    label: '团队',
    children: [
      { key: 'members', label: '成员' },
      { key: 'roles', label: '角色' },
      { key: 'invitations', label: '邀请', badge: 3 },
    ],
  },
  {
    key: 'projects',
    label: '项目',
    children: [
      { key: 'active', label: '进行中' },
      { key: 'archive', label: '归档' },
    ],
  },
  { key: 'settings', label: '设置' },
];

function expandAll() {
  openKeys.value = ['team', 'projects'];
}
function collapseAll() {
  openKeys.value = [];
}
</script>

<template>
  <div class="demo-row">
    <CfButton size="sm" variant="tertiary" @click="expandAll">全部展开</CfButton>
    <CfButton size="sm" variant="tertiary" @click="collapseAll">全部收起</CfButton>
    <span class="adm-hint">openKeys = [{{ openKeys.join(', ') }}]</span>
  </div>

  <CfSidebar
    v-model="active"
    v-model:open-keys="openKeys"
    :items="items"
  />
</template>

<style scoped>
.demo-row { margin-bottom: 12px; }
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-left: 8px; font-family: var(--font-mono); }
</style>
