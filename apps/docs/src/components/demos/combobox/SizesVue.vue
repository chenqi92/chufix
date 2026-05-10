<script setup lang="ts">
import { ref } from 'vue';
import { CfCombobox, type ComboboxOption } from '@chufix-design/vue';

const a = ref<string | number | null>(null);
const b = ref<string | number | null>(null);
const c = ref<string | number | null>(null);
const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
    <CfCombobox v-model="a" :options="options" size="sm" placeholder="sm" />
    <CfCombobox v-model="b" :options="options" size="md" placeholder="md" />
    <CfCombobox v-model="c" :options="options" size="lg" placeholder="lg" />
  </div>
</template>
