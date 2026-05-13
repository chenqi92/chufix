<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfTooltip } from '@chufix-design/vue';

const disabled = ref<boolean>(false);
</script>

<template>
  <div class="demo-row">
    <CfTooltip content="hover 才会出现" :disabled="disabled">
      <CfButton variant="tertiary">悬停我</CfButton>
    </CfTooltip>

    <CfButton size="sm" variant="ghost" @click="disabled = !disabled">
      {{ disabled ? '启用 tooltip' : '禁用 tooltip' }}
    </CfButton>
    <span class="adm-hint">当前 disabled = {{ disabled }}</span>
  </div>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); }
</style>
