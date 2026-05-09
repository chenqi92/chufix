<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfPopover } from '@chufix/vue';

const manualOpen = ref(false);
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <CfPopover trigger="click" placement="bottom">
      <CfButton variant="secondary">click</CfButton>
      <template #content>点击触发，再次点击或点外部关闭</template>
    </CfPopover>

    <CfPopover trigger="hover" placement="bottom">
      <CfButton variant="secondary">hover</CfButton>
      <template #content>悬停触发，鼠标移开延时关闭</template>
    </CfPopover>

    <CfPopover trigger="manual" :open="manualOpen" @update:open="(v) => manualOpen = v">
      <CfButton variant="secondary" @click="manualOpen = !manualOpen">
        manual ({{ manualOpen ? '已开' : '已关' }})
      </CfButton>
      <template #content>受控模式 — 完全由父组件 open 决定</template>
    </CfPopover>
  </div>
</template>
