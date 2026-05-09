<script setup lang="ts">
import { ref } from 'vue';
import { CfFilePicker } from '@chufix/vue';
const a = ref<File[]>([]);
const b = ref<File[]>([]);
const c = ref<File[]>([]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <span style="font-size: 11px; color: var(--fg-3); margin-right: 8px;">single + outline</span>
      <CfFilePicker v-model="a" accept="image/*" />
    </div>
    <div>
      <span style="font-size: 11px; color: var(--fg-3); margin-right: 8px;">multiple + plain + size lg</span>
      <CfFilePicker v-model="b" multiple variant="plain" size="lg" button-text="批量上传" />
    </div>
    <div>
      <span style="font-size: 11px; color: var(--fg-3); margin-right: 8px;">disabled</span>
      <CfFilePicker v-model="c" disabled />
    </div>
  </div>
</template>
