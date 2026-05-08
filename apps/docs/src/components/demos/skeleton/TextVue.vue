<script setup lang="ts">
import { CfSkeleton } from '@chufix/vue';
</script>

<template>
  <div style="max-width: 22rem; width: 100%;">
    <CfSkeleton shape="text" :lines="4" />
  </div>
</template>
