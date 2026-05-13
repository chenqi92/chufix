<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
const c = ref('');
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfOtpInput v-model="a" :length="4" />
    </div>
    <div>
      <CfOtpInput v-model="b" :length="6" />
    </div>
    <div>
      <CfOtpInput v-model="c" :length="8" />
    </div>
  </div>
</template>
