<script setup lang="ts">
import { ref } from 'vue';
import { CfSegmentedControl } from '@chufix-design/vue';

const view = ref('list');
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfSegmentedControl
      v-model="view"
      :items="[
        { value: 'list', label: '列表' },
        { value: 'card', label: '卡片' },
        { value: 'kanban', label: '看板' },
      ]"
    />
    <span style="font-size: 12px; color: var(--fg-3);">view = <code>{{ view }}</code></span>
  </div>
</template>
