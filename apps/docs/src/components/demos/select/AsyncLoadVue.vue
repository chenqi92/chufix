<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix-design/vue';

const loading = ref(true);
const options = ref<SelectOption[]>([]);
const value = ref<string | null>(null);

onMounted(() => {
  setTimeout(() => {
    options.value = [
      { value: 'a', label: '从远端加载的选项 A' },
      { value: 'b', label: '从远端加载的选项 B' },
      { value: 'c', label: '从远端加载的选项 C' },
    ];
    loading.value = false;
  }, 1200);
});
</script>

<template>
  <CfSelect
    v-model="value"
    :options="options"
    :loading="loading"
    placeholder="loading=true 时显示 spinner"
    style="max-width: 280px;"
  />
</template>
