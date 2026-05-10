<script setup lang="ts">
import { CfToolbar, CfToolbarSeparator, CfIconButton, CfButton } from '@chufix-design/vue';
</script>

<template>
  <CfToolbar>
    <CfIconButton aria-label="撤销">↶</CfIconButton>
    <CfIconButton aria-label="重做">↷</CfIconButton>
    <CfToolbarSeparator />
    <CfButton variant="ghost" size="sm">Duplicate</CfButton>
    <CfButton variant="ghost" size="sm">Delete</CfButton>
  </CfToolbar>
</template>
