<script setup lang="ts">
import { CfSkeleton } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="max-width: 22rem;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">shimmer 动画（默认）</div>
      <CfSkeleton shape="rect" :height="40" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">static —— 关闭动画，纯色块</div>
      <CfSkeleton shape="rect" :height="40" static />
    </div>
  </div>
</template>
