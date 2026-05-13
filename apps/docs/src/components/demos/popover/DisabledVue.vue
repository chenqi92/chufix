<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfPopover } from '@chufix-design/vue';

const disabled = ref<boolean>(false);
</script>

<template>
  <div class="demo-row">
    <CfPopover placement="bottom" :disabled="disabled">
      <CfButton variant="secondary">点击展开</CfButton>
      <template #content>
        <strong>已启用</strong>
        <p class="adm-p">Popover 内容…</p>
      </template>
    </CfPopover>

    <CfButton size="sm" variant="ghost" @click="disabled = !disabled">
      {{ disabled ? '启用' : '禁用' }} popover
    </CfButton>
    <span class="adm-hint">当前 disabled = {{ disabled }}</span>
  </div>
</template>

<style scoped>
.adm-p { margin: 4px 0 0; color: var(--fg-2); }
.adm-hint { color: var(--fg-3); font-size: var(--t-12); }
</style>
