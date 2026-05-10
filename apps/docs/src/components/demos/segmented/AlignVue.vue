<script setup lang="ts">
import { ref } from 'vue';
import { CfSegmentedControl } from '@chufix-design/vue';

const a = ref('day');
const b = ref('day');
const c = ref('day');
const d = ref('day');

const items = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">align = start（默认）</div>
      <CfSegmentedControl v-model="a" :items="items" align="start" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">align = center</div>
      <CfSegmentedControl v-model="b" :items="items" align="center" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">align = end</div>
      <CfSegmentedControl v-model="c" :items="items" align="end" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">align = stretch（撑满）</div>
      <CfSegmentedControl v-model="d" :items="items" align="stretch" />
    </div>
  </div>
</template>
