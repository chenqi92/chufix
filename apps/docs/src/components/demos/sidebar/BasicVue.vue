<script setup lang="ts">
import { ref } from 'vue';
import { CfSidebar, type SidebarEntry } from '@chufix/vue';

const active = ref('analytics');
const items: SidebarEntry[] = [
  {
    type: 'group',
    label: '工作台',
    items: [
      { key: 'overview', label: '概览' },
      { key: 'analytics', label: '分析', badge: '12' },
      { key: 'reports', label: '报表' },
    ],
  },
  {
    type: 'group',
    label: '资源',
    items: [
      {
        key: 'team',
        label: '团队',
        children: [
          { key: 'members', label: '成员' },
          { key: 'roles', label: '角色' },
          { key: 'invitations', label: '邀请', badge: 3 },
        ],
      },
      { key: 'settings', label: '设置' },
      { key: 'billing', label: '账单', disabled: true },
    ],
  },
];
</script>

<template>
  <div style="height: 360px; display:flex; gap: 12px;">
    <div style="border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
      <CfSidebar
        v-model="active"
        :items="items"
        :default-open-keys="['team']"
      />
    </div>
    <div style="flex:1; padding: 12px; color: var(--fg-2); font-size: 12px;">
      当前选中：<code>{{ active }}</code>
    </div>
  </div>
</template>
