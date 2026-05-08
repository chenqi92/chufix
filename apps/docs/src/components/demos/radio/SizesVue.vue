<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from '@chufix/vue';

const a = ref('s');
const b = ref('m');
const c = ref('l');
</script>

<template>
  <div class="demo-stack">
    <RadioGroup v-model="a" size="sm">
      <Radio value="s">Small</Radio>
      <Radio value="t">Tiny</Radio>
    </RadioGroup>
    <RadioGroup v-model="b" size="md">
      <Radio value="m">Medium</Radio>
      <Radio value="r">Regular</Radio>
    </RadioGroup>
    <RadioGroup v-model="c" size="lg">
      <Radio value="l">Large</Radio>
      <Radio value="x">Extra Large</Radio>
    </RadioGroup>
  </div>
</template>
