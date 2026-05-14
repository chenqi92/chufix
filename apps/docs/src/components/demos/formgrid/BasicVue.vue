<script setup lang="ts">
import { CfFormGrid, CfFieldRow } from '@chufix-design/vue';
</script>

<template>
  <CfFormGrid :columns="{ sm: 1, md: 2, lg: 3 }" :gap="16">
    <CfFieldRow label="姓"><input class="cf-input" /></CfFieldRow>
    <CfFieldRow label="名"><input class="cf-input" /></CfFieldRow>
    <CfFieldRow label="昵称"><input class="cf-input" /></CfFieldRow>
    <CfFieldRow label="邮箱"><input class="cf-input" /></CfFieldRow>
    <CfFieldRow label="电话"><input class="cf-input" /></CfFieldRow>
    <CfFieldRow label="城市"><input class="cf-input" /></CfFieldRow>
  </CfFormGrid>
</template>
