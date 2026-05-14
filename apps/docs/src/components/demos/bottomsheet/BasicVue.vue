<script setup lang="ts">
import { ref } from 'vue';
import { CfBottomSheet, CfButton } from '@chufix-design/vue';

const open = ref(false);
</script>

<template>
  <div class="demo-stack">
    <CfButton @click="open = true">打开底部 Sheet</CfButton>
    <CfBottomSheet v-model:open="open" title="选择操作" :snap-points="['40%', '90%']">
      <ul class="demo-list">
        <li>编辑</li>
        <li>分享</li>
        <li>归档</li>
        <li>静音通知</li>
        <li style="color: var(--status-error);">删除</li>
      </ul>
    </CfBottomSheet>
  </div>
</template>

<style scoped>
.demo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.demo-list li { padding: 12px; background: var(--bg-2); border-radius: var(--r-4); }
</style>
