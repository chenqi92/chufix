<script setup lang="ts">
import { CfAccordion } from '@chufix-design/vue';

const items = [
  { value: 'a', title: '面板 A', content: '面板 A 的内容…' },
  { value: 'b', title: '面板 B', content: '面板 B 的内容…' },
  { value: 'c', title: '面板 C', content: '面板 C 的内容…' },
];
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 36rem;">
    <div>
      <CfAccordion :items="items" variant="bordered" />
    </div>
    <div>
      <CfAccordion :items="items" variant="flush" />
    </div>
    <div>
      <CfAccordion :items="items" variant="separated" />
    </div>
  </div>
</template>
