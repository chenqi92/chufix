<script setup lang="ts">
import { ref } from 'vue';
import { CfTabs } from '@chufix-design/vue';

const items = [
  { value: 'one',   label: '一' },
  { value: 'two',   label: '二' },
  { value: 'three', label: '三' },
];
const a = ref<string>('one');
const b = ref<string>('one');
const c = ref<string>('one');
const d = ref<string>('one');
</script>

<template>
  <div class="demo-stack">
    <div>
      <p class="demo-hint">align = start（默认）</p>
      <CfTabs v-model="a" :items="items" align="start" />
    </div>
    <div>
      <p class="demo-hint">align = center</p>
      <CfTabs v-model="b" :items="items" align="center" />
    </div>
    <div>
      <p class="demo-hint">align = end</p>
      <CfTabs v-model="c" :items="items" align="end" />
    </div>
    <div>
      <p class="demo-hint">align = stretch</p>
      <CfTabs v-model="d" :items="items" align="stretch" />
    </div>
  </div>
</template>

<style scoped>
.demo-hint { margin: 0 0 4px; color: var(--fg-3); font-size: var(--t-12); }
</style>
