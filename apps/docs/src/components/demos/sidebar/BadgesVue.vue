<script setup lang="ts">
import { ref } from 'vue';
import { CfSidebar, type SidebarEntry } from '@chufix/vue';

const active = ref('inbox');
const items: SidebarEntry[] = [
  { key: 'inbox', label: '收件箱', badge: 12 },
  { key: 'starred', label: '加星' },
  { key: 'sent', label: '已发送' },
  { key: 'drafts', label: '草稿', badge: 'NEW' },
  { key: 'trash', label: '已删除', disabled: true },
];
</script>

<template>
  <CfSidebar v-model="active" :items="items" />
</template>
