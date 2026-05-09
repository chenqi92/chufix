<script setup lang="ts">
import { ref } from 'vue';
import { CfSegmentedControl } from '@chufix/vue';

const view = ref('list');
const period = ref('week');
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px; align-items: flex-start;">
    <CfSegmentedControl
      v-model="view"
      :items="[
        { value: 'list', label: '列表' },
        { value: 'card', label: '卡片' },
        { value: 'kanban', label: '看板' },
      ]"
    />
    <CfSegmentedControl
      v-model="period"
      size="sm"
      :items="[
        { value: 'day', label: '日' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
        { value: 'year', label: '年' },
      ]"
    />
    <span style="font-size: 12px; color: var(--fg-3);">
      view = <code>{{ view }}</code> · period = <code>{{ period }}</code>
    </span>
  </div>
</template>
