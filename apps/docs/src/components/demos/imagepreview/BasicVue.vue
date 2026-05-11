<script setup lang="ts">
import { ref } from 'vue';
import { CfImagePreview, CfButton } from '@chufix-design/vue';

const open = ref(false);
const src = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1600&h=900&fit=crop';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
    <img
      :src="src.replace('1600&h=900', '320&h=180')"
      alt="缩略图"
      style="width: 200px; height: auto; border-radius: 8px; cursor: zoom-in;"
      @click="open = true"
    />
    <CfButton size="sm" @click="open = true">点击预览大图</CfButton>
    <CfImagePreview v-model="open" :src="src" alt="示例图" />
  </div>
</template>
