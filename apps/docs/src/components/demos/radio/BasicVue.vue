<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from '@chufix/vue';

const plan = ref<'free' | 'pro' | 'team'>('pro');
</script>

<template>
  <div class="demo-stack">
    <RadioGroup v-model="plan" name="plan">
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
    <p class="demo-hint">已选：<code>{{ plan }}</code></p>
  </div>
</template>
