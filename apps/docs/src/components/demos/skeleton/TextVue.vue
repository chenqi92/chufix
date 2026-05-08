<script setup lang="ts">
import { Skeleton } from '@chufix/vue';
</script>

<template>
  <div style="max-width: 22rem; width: 100%;">
    <Skeleton shape="text" :lines="4" />
  </div>
</template>
