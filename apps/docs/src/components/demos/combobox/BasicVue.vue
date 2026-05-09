<script setup lang="ts">
import { ref } from 'vue';
import { CfCombobox, type ComboboxOption } from '@chufix/vue';

const value = ref<string | number | null>('vue');
const options: ComboboxOption[] = [
  { value: 'vue', label: 'Vue 3' },
  { value: 'react', label: 'React 18' },
  { value: 'svelte', label: 'Svelte 5' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'angular', label: 'Angular' },
  { value: 'qwik', label: 'Qwik' },
];
</script>

<template>
  <div style="display:flex; gap: 12px; align-items: flex-start;">
    <CfCombobox v-model="value" :options="options" clearable />
    <span style="font-size: 12px; color: var(--fg-3); align-self: center;">
      当前：{{ value ?? '(无)' }}
    </span>
  </div>
</template>
