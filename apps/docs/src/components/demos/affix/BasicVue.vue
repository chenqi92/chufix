<script setup lang="ts">
import { CfAffix, CfButton } from '@chufix/vue';
</script>

<template>
  <div style="height: 400px; overflow-y: auto; border: 1px solid var(--line-1); border-radius: 8px; padding: 12px;">
    <p v-for="i in 6" :key="`a-${i}`">前置文字 {{ i }}</p>
    <CfAffix :offset-top="0">
      <div style="background: var(--bg-2); padding: 8px; border: 1px solid var(--accent-1); border-radius: 6px;">
        <CfButton size="sm">滚动到这里时这一行会吸顶</CfButton>
      </div>
    </CfAffix>
    <p v-for="i in 30" :key="`b-${i}`">后置文字 {{ i }}</p>
  </div>
</template>
