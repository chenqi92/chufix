<script setup lang="ts">
import { CfBreadcrumb } from '@chufix-design/vue';

const items = [
  { label: '首页', href: '/' },
  { label: '组织', href: '/orgs/' },
  { label: '某团队', href: '/orgs/team-x/' },
  { label: '项目', href: '/orgs/team-x/projects/' },
  { label: '深层目录' },
];
</script>

<template>
  <CfBreadcrumb :items="items" separator="›" />
</template>
