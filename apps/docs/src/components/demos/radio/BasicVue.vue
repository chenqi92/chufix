<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from '@chukit/vue';

const plan = ref<'free' | 'pro' | 'team'>('pro');
const direction = ref<'row' | 'column'>('row');
</script>

<template>
  <div class="demo-stack">
    <RadioGroup v-model="plan" name="plan">
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
    <p class="demo-hint">已选：<code>{{ plan }}</code></p>

    <RadioGroup v-model="direction" direction="column">
      <Radio value="row">竖直方向 column</Radio>
      <Radio value="column" disabled>禁用项</Radio>
    </RadioGroup>
  </div>
</template>
