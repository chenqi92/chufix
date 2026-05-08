<script setup lang="ts">
import { CfCheckbox } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <CfCheckbox size="sm" :model-value="true">sm 已选</CfCheckbox>
    <CfCheckbox size="md" :model-value="true">md 已选</CfCheckbox>
    <CfCheckbox size="lg" :model-value="true">lg 已选</CfCheckbox>
    <CfCheckbox disabled>禁用</CfCheckbox>
    <CfCheckbox disabled :model-value="true">禁用已选</CfCheckbox>
  </div>
</template>
