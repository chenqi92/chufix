<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfOtpInput v-model="a" :length="6" type="numeric" />
    </div>
    <div>
      <CfOtpInput v-model="b" :length="6" type="alphanumeric" />
    </div>
  </div>
</template>
