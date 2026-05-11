<script setup lang="ts">
import { CfFloatButton } from '@chufix-design/vue';
</script>

<template>
  <div style="position: relative; height: 220px; border: 1px dashed var(--line-1); border-radius: 8px; padding: 16px;">
    <p style="margin: 0; color: var(--fg-2);">真实页面里 FloatButton 默认是 <code>position: fixed</code>，固定在视口右下；这里 demo 用 <code>style="position: absolute"</code> 把它锁在容器内，方便演示。</p>
    <CfFloatButton
      :style="{ position: 'absolute' }"
      tooltip="联系客服"
      badge="3"
      :bottom="16"
      :right="16"
      variant="primary"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    </CfFloatButton>
  </div>
</template>
