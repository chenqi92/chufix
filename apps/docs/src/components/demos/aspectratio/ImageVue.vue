<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';
</script>

<template>
  <div style="max-width: 480px;">
    <CfAspectRatio :ratio="16 / 9">
      <div style="background: var(--bg-2); border: 1px solid var(--line-1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: var(--fg-3); font-size: 14px;">
        子元素 absolute 撑满 — 放 &lt;img&gt; / &lt;video&gt; / &lt;iframe&gt; 都自动 100% × 100%
      </div>
    </CfAspectRatio>
  </div>
</template>
