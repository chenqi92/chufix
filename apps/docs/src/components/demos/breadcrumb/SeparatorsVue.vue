<script setup lang="ts">
import { CfBreadcrumb } from '@chufix/vue';

const items = [
  { label: '首页', href: '/' },
  { label: '设置', href: '/settings/' },
  { label: '账号' },
];
</script>

<template>
  <div class="demo-stack">
    <CfBreadcrumb :items="items" separator="/" />
    <CfBreadcrumb :items="items" separator="›" />
    <CfBreadcrumb :items="items" separator="·" />
    <CfBreadcrumb :items="items" separator="→" />
  </div>
</template>
