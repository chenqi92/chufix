<script setup lang="ts">
import { ref } from 'vue';
import { CfCalendar } from '@chufix-design/vue';

const a = ref<Date | null>(null);
const b = ref<Date | null>(null);
</script>

<template>
  <div style="display:flex; gap: 16px; flex-wrap: wrap;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">周一开始 + 周序号</div>
      <CfCalendar v-model="a" :week-starts-on="1" show-week-numbers />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">周日开始</div>
      <CfCalendar v-model="b" :week-starts-on="0" />
    </div>
  </div>
</template>
