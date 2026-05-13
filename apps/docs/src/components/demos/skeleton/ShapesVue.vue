<script setup lang="ts">
import { CfSkeleton } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="max-width: 22rem;">
    <div>
      <CfSkeleton shape="text" :width="240" />
    </div>
    <div>
      <CfSkeleton shape="circle" :width="48" :height="48" />
    </div>
    <div>
      <CfSkeleton shape="rect" :height="80" />
    </div>
  </div>
</template>
