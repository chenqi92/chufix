<script setup lang="ts">
import { ref } from 'vue';
import { CfPhoneInput } from '@chufix-design/vue';
const phone = ref('138 0013 8000');
const country = ref('CN');
</script>

<template>
  <div style="max-width: 360px;">
    <CfPhoneInput v-model="phone" v-model:country="country" />
    <div style="margin-top: 8px; font-size: 12px; color: var(--fg-3); font-family: var(--font-mono);">
      {{ country }} · {{ phone }}
    </div>
  </div>
</template>
