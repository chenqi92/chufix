<script setup lang="ts">
import { CfStepper, type StepItem } from '@chufix/vue';

const items: StepItem[] = [
  { title: '设计' },
  { title: '开发' },
  { title: '测试' },
  { title: '上线' },
];
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 24px;">
    <CfStepper :items="items" :current="2" variant="numbered" />
    <CfStepper :items="items" :current="2" variant="dots" />
    <CfStepper :items="items" :current="2" variant="minimal" />
  </div>
</template>
