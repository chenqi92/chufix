<script setup lang="ts">
import { ref } from 'vue';
import { CfRadio, CfRadioGroup } from '@chufix/vue';

const plan = ref<'free' | 'pro' | 'team'>('pro');
</script>

<template>
  <div class="demo-stack">
    <CfRadioGroup v-model="plan" name="plan">
      <CfRadio value="free">Free</CfRadio>
      <CfRadio value="pro">Pro</CfRadio>
      <CfRadio value="team">Team</CfRadio>
    </CfRadioGroup>
    <p class="demo-hint">已选：<code>{{ plan }}</code></p>
  </div>
</template>
