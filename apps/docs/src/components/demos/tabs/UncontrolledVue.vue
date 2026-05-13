<script setup lang="ts">
import { CfTabs } from '@chufix-design/vue';

const items = [
  { value: 'overview',  label: '概览' },
  { value: 'activity',  label: '动态' },
  { value: 'settings',  label: '设置' },
];
</script>

<template>
  <CfTabs :items="items">
    <template #default="{ active }">
      <div v-if="active === 'overview'">概览页面 —— 默认激活第一项</div>
      <div v-if="active === 'activity'">动态页面</div>
      <div v-if="active === 'settings'">设置页面</div>
    </template>
  </CfTabs>
</template>
