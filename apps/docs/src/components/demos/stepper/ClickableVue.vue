<script setup lang="ts">
import { ref } from 'vue';
import { CfStepper, type StepItem } from '@chufix-design/vue';

const current = ref<number>(1);
const items: StepItem[] = [
  { title: '填写信息', description: '账号 / 邮箱' },
  { title: '验证邮箱', description: '收到的链接' },
  { title: '完成', description: '开始使用' },
];

function handleChange(index: number, item: StepItem) {
  current.value = index;
  console.log('change →', index, item.title);
}
</script>

<template>
  <CfStepper
    :items="items"
    :current="current"
    clickable
    @change="handleChange"
  />
  <p class="adm-hint">当前 current = {{ current }} —— 直接点击任意步骤切换</p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 8px; }
</style>
