<script setup lang="ts">
import { CfHoverCard } from '@chufix-design/vue';
</script>

<template>
  <CfHoverCard>
    <span style="background: var(--bg-2); padding: 4px 8px; border-radius: var(--r-3); cursor: pointer;">@jane.l</span>
    <template #content>
      <div style="display: flex; gap: 10px;">
        <span style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-1); display: inline-flex; align-items: center; justify-content: center; color: var(--fg-on-accent); font-weight: 500;">JL</span>
        <div>
          <div style="font-weight: 500; color: var(--fg-1);">Jane Liu</div>
          <div style="font-size: 11px; color: var(--fg-3); font-family: var(--font-mono);">jane.l@example.com</div>
          <div style="font-size: 12px; color: var(--fg-2); margin-top: 4px;">Backend · Payments · UTC+8</div>
        </div>
      </div>
    </template>
  </CfHoverCard>
</template>
