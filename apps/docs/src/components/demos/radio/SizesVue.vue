<script setup lang="ts">
import { ref } from 'vue';
import { CfRadio, CfRadioGroup } from '@chufix-design/vue';

const a = ref('s');
const b = ref('m');
const c = ref('l');
</script>

<template>
  <div class="demo-stack">
    <CfRadioGroup v-model="a" size="sm">
      <CfRadio value="s">Small</CfRadio>
      <CfRadio value="t">Tiny</CfRadio>
    </CfRadioGroup>
    <CfRadioGroup v-model="b" size="md">
      <CfRadio value="m">Medium</CfRadio>
      <CfRadio value="r">Regular</CfRadio>
    </CfRadioGroup>
    <CfRadioGroup v-model="c" size="lg">
      <CfRadio value="l">Large</CfRadio>
      <CfRadio value="x">Extra Large</CfRadio>
    </CfRadioGroup>
  </div>
</template>
