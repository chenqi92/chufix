<script setup lang="ts">
import { CfBreadcrumb } from '@chufix-design/vue';

const items = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components/' },
  { label: 'Breadcrumb 面包屑' },
];
</script>

<template>
  <CfBreadcrumb :items="items" />
</template>
