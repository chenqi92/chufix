<script setup lang="ts">
import { CfJsonViewer } from '@chufix/vue';

const data = {
  id: 'usr_2k1b9e',
  name: '张小明',
  active: true,
  createdAt: '2025-04-19T08:14:00Z',
  tags: ['admin', 'beta'],
};
</script>

<template>
  <CfJsonViewer :data="data" />
</template>
