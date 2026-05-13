<script setup lang="ts">
import { CfMethodBadge } from '@chufix-design/vue';

const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
</script>

<template>
  <div class="demo-row" style="flex-wrap: wrap;">
    <CfMethodBadge v-for="method in methods" :key="method" :kind="method" />
  </div>
</template>
