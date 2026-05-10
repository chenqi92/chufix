<script setup lang="ts">
import { CfImage } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <CfImage
      src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=320&h=180&fit=crop"
      alt="风景"
      :width="160"
      :height="100"
      rounded
      bordered
    />
    <CfImage
      src="https://example.com/broken-image.jpg"
      alt="加载失败示例"
      :width="160"
      :height="100"
      rounded
      bordered
    />
  </div>
</template>
