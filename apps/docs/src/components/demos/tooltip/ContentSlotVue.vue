<script setup lang="ts">
import { CfButton, CfTooltip } from '@chufix-design/vue';
</script>

<template>
  <CfTooltip placement="bottom" :max-width="260">
    <CfButton variant="tertiary">富文本内容</CfButton>
    <template #content>
      <div class="adm-rich">
        <strong>键盘快捷键</strong>
        <kbd>⌘</kbd> + <kbd>K</kbd> 打开命令面板
      </div>
    </template>
  </CfTooltip>

  <CfTooltip placement="bottom" :max-width="220">
    <CfButton variant="tertiary">多行说明</CfButton>
    <template #content>
      <div class="adm-rich">
        <span class="adm-title">同步状态</span>
        最近同步：<span class="adm-mono">2026-05-12 14:30</span>
        <br />
        下次同步：<span class="adm-mono">14:45</span>
      </div>
    </template>
  </CfTooltip>
</template>

<style scoped>
.adm-rich {
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.55;
}
.adm-title { font-weight: 600; }
.adm-mono { font-family: var(--font-mono); font-size: 0.9em; }
kbd {
  font-family: var(--font-mono);
  background: rgb(255 255 255 / 0.14);
  border-radius: 3px;
  padding: 0 4px;
  font-size: 0.9em;
}
</style>
