<script setup lang="ts">
import { Checkbox } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Checkbox size="sm" :model-value="true">sm 已选</Checkbox>
    <Checkbox size="md" :model-value="true">md 已选</Checkbox>
    <Checkbox size="lg" :model-value="true">lg 已选</Checkbox>
    <Checkbox disabled>禁用</Checkbox>
    <Checkbox disabled :model-value="true">禁用已选</Checkbox>
  </div>
</template>
