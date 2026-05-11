<script setup lang="ts">
import { ref } from 'vue';
import { CfCalendar } from '@chufix-design/vue';

const a = ref<Date | null>(null);
const b = ref<Date | null>(null);
const c = ref<Date | null>(null);
</script>

<template>
  <div style="display:flex; gap: 16px; flex-wrap: wrap; align-items: flex-start;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = sm</div>
      <CfCalendar v-model="a" size="sm" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = md</div>
      <CfCalendar v-model="b" size="md" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = lg</div>
      <CfCalendar v-model="c" size="lg" />
    </div>
  </div>
</template>
