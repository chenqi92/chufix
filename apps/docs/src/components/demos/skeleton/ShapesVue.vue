<script setup lang="ts">
import { CfSkeleton } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack" style="max-width: 22rem;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">shape = text（一根细线）</div>
      <CfSkeleton shape="text" :width="240" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">shape = circle（圆形头像 / 图标占位）</div>
      <CfSkeleton shape="circle" :width="48" :height="48" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">shape = rect（矩形块 / 图片占位）</div>
      <CfSkeleton shape="rect" :height="80" />
    </div>
  </div>
</template>
