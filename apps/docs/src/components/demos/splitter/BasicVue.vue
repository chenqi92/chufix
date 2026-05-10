<script setup lang="ts">
import { ref } from 'vue';
import { CfSplitter } from '@chufix-design/vue';

const size = ref(35);
</script>

<template>
  <div style="height: 240px; border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
    <CfSplitter v-model="size" :min="15" :max="85">
      <template #start>
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 8px;">侧栏</h3>
          <p style="margin: 0; font-size: 12px; color: var(--fg-3);">
            当前宽度：{{ Math.round(size) }}%。拖动中间分隔条调整。
          </p>
        </div>
      </template>
      <template #end>
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 8px;">主区域</h3>
          <p style="margin: 0; font-size: 12px; color: var(--fg-3);">
            键盘可用：聚焦分隔条后 ←→ 微调，Shift+←→ 跳大步，Home/End 直接到极值。
          </p>
        </div>
      </template>
    </CfSplitter>
  </div>
</template>
