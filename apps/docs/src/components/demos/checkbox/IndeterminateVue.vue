<script setup lang="ts">
import { computed, ref } from 'vue';
import { Checkbox } from '@chufix/vue';

const apple = ref(true);
const banana = ref(false);
const cherry = ref(false);

const count = computed(
  () => [apple.value, banana.value, cherry.value].filter(Boolean).length,
);
const all = computed({
  get: () => count.value === 3,
  set(v) {
    apple.value = v;
    banana.value = v;
    cherry.value = v;
  },
});
const indeterminate = computed(() => count.value > 0 && count.value < 3);
</script>

<template>
  <div class="demo-stack">
    <Checkbox v-model="all" :indeterminate="indeterminate">全选</Checkbox>
    <div class="demo-row" style="padding-left: 1.5rem;">
      <Checkbox v-model="apple">苹果</Checkbox>
      <Checkbox v-model="banana">香蕉</Checkbox>
      <Checkbox v-model="cherry">樱桃</Checkbox>
    </div>
  </div>
</template>
