<script setup lang="ts">
import { ref } from 'vue';
import { CfRadio, CfRadioGroup } from '@chufix/vue';

const flavor = ref('vanilla');
</script>

<template>
  <CfRadioGroup v-model="flavor" direction="column">
    <CfRadio value="vanilla">香草</CfRadio>
    <CfRadio value="chocolate">巧克力</CfRadio>
    <CfRadio value="strawberry" disabled>草莓（缺货）</CfRadio>
    <CfRadio value="matcha">抹茶</CfRadio>
  </CfRadioGroup>
</template>
