<script setup lang="ts">
import { computed, ref } from 'vue';
import { Checkbox } from '@chukit/vue';

const apple = ref(true);
const banana = ref(false);
const cherry = ref(false);

const checkedCount = computed(
  () => [apple.value, banana.value, cherry.value].filter(Boolean).length,
);
const all = computed({
  get: () => checkedCount.value === 3,
  set(v) {
    apple.value = v;
    banana.value = v;
    cherry.value = v;
  },
});
const indeterminate = computed(
  () => checkedCount.value > 0 && checkedCount.value < 3,
);
</script>

<template>
  <div class="demo-stack">
    <Checkbox v-model="all" :indeterminate="indeterminate">全选</Checkbox>
    <div class="demo-row">
      <Checkbox v-model="apple">苹果</Checkbox>
      <Checkbox v-model="banana">香蕉</Checkbox>
      <Checkbox v-model="cherry">樱桃</Checkbox>
    </div>
    <div class="demo-row">
      <Checkbox size="sm" :model-value="true">sm 已选</Checkbox>
      <Checkbox size="lg">lg</Checkbox>
      <Checkbox disabled>禁用</Checkbox>
      <Checkbox disabled :model-value="true">禁用已选</Checkbox>
    </div>
  </div>
</template>
