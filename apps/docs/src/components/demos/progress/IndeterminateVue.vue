<script setup lang="ts">
import { CfProgress } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 28rem;">
    <CfProgress indeterminate />
    <CfProgress indeterminate tone="success" />
    <CfProgress indeterminate tone="danger" size="sm" />
  </div>
</template>
