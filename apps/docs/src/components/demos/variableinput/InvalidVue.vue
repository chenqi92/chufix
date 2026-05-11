<script setup lang="ts">
import { ref } from 'vue';
import { CfVariableAwareInput } from '@chufix-design/vue';
const v1 = ref('valid only: {{base_url}} / {{user_id}}');
const v2 = ref('mixed: {{base_url}}/v1/{{token}}/users/{{user_id}}');
const v3 = ref('all unknown: {{a}} {{b}} {{c}}');
const known = ['base_url', 'user_id'];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 720px;">
    <CfVariableAwareInput v-model="v1" :variables="known" />
    <CfVariableAwareInput v-model="v2" :variables="known" />
    <CfVariableAwareInput v-model="v3" :variables="known" />
  </div>
</template>
