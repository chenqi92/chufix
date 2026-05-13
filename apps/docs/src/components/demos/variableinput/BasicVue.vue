<script setup lang="ts">
import { ref } from 'vue';
import { CfVariableAwareInput } from '@chufix-design/vue';
const value = ref('{{base_url}}/users/{{user_id}}/orders?token={{auth_token}}');
const known = ['base_url', 'user_id', 'auth_token'];
</script>

<template>
  <div style="width: 100%; max-width: 920px;">
    <CfVariableAwareInput v-model="value" :variables="known" placeholder="试试输入 {{base_url}}…" />
    <div style="margin-top: 8px; font-size: 12px; color: var(--fg-3);">
      已知变量：{{ known.join(' · ') }}
    </div>
  </div>
</template>
