<script setup lang="ts">
import { ref } from 'vue';
import { CfIcon, CfIconPicker } from '@chufix-design/vue';
import type { IconName } from '@chufix-design/icons';

const icon = ref<IconName>('activity');
</script>

<template>
  <div class="demo-stack">
    <CfIconPicker v-model="icon" searchable clearable />
    <div class="demo-preview">
      <CfIcon v-if="icon" :name="icon" />
      <span>{{ icon || '未选择' }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-preview {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line-1);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--surface-1);
  color: var(--fg-1);
}
</style>
