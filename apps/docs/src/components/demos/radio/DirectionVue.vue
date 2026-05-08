<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from '@chufix/vue';

const flavor = ref('vanilla');
</script>

<template>
  <RadioGroup v-model="flavor" direction="column">
    <Radio value="vanilla">香草</Radio>
    <Radio value="chocolate">巧克力</Radio>
    <Radio value="strawberry" disabled>草莓（缺货）</Radio>
    <Radio value="matcha">抹茶</Radio>
  </RadioGroup>
</template>
