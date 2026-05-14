<script setup lang="ts">
import { ref } from 'vue';
import { CfBottomSheet, CfButton } from '@chufix-design/vue';

const open = ref(false);
const snap = ref(0);
</script>

<template>
  <div class="demo-stack">
    <CfButton @click="open = true">打开多停靠点 Sheet</CfButton>
    <CfBottomSheet
      v-model:open="open"
      title="详情"
      :snap-points="[180, '50%', '90%']"
      :initial-snap="1"
      @snap-change="snap = $event"
    >
      <p>当前停靠点：<code>{{ snap }}</code> — 拖动顶部 grabber 在三档之间切换。</p>
      <p>支持下拉关闭：拖到最低停靠点以下 1/3 panel 高度，或快速下拉（速度 &gt; 0.5 px/ms）即关闭。</p>
      <p v-for="i in 20" :key="i">演示内容行 #{{ i }}</p>
    </CfBottomSheet>
  </div>
</template>
