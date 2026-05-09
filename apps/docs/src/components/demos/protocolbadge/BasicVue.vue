<script setup lang="ts">
import { CfProtocolBadge } from '@chufix/vue';
const protos = ['get','post','put','patch','del','head','opt','ws','mqtt','grpc','sse','gql'];
</script>

<template>
  <div class="demo-row" style="flex-wrap: wrap;">
    <CfProtocolBadge v-for="p in protos" :key="p" :kind="p" />
  </div>
</template>
