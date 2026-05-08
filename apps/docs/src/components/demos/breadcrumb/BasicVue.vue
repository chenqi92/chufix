<script setup lang="ts">
import { CfBreadcrumb } from '@chufix/vue';

const items = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components/' },
  { label: 'Breadcrumb 面包屑' },
];
</script>

<template>
  <div class="demo-stack">
    <CfBreadcrumb :items="items" />
    <CfBreadcrumb :items="items" separator="›" />
    <CfBreadcrumb :items="items" separator="·" />
  </div>
</template>
