<script setup lang="ts">
import { CfAlert } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAlert tone="info" :icon="false" title="无图标版本">省去左侧 status 图标，更紧凑。</CfAlert>
    <CfAlert tone="success" :icon="false">仅一行文字，最克制的提示形式。</CfAlert>
  </div>
</template>
