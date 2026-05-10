<script setup lang="ts">
import { CfJsonViewer } from '@chufix-design/vue';

const data = {
  api: '/v1/users',
  pagination: { page: 1, pageSize: 20, total: 312 },
  filters: { active: true, role: 'admin' },
  meta: {
    plan: 'pro',
    seats: 12,
    nullable: null,
    flags: { darkMode: true, beta: false },
  },
};
</script>

<template>
  <CfJsonViewer :data="data" :default-expand-depth="3" show-types />
</template>
