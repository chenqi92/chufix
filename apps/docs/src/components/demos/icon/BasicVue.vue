<script setup lang="ts">
import { CfIcon, type IconName } from '@chufix/vue';

const icons: IconName[] = [
  'search',
  'check-circle',
  'alert-circle',
  'calendar',
  'table',
  'layout',
  'modal',
  'component',
  'theme-token',
  'schema',
  'diff',
  'sandbox',
];
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="gap: 1.25rem; align-items: center;">
      <CfIcon name="search" size="sm" />
      <CfIcon name="search" size="md" />
      <CfIcon name="search" size="lg" />
      <CfIcon name="search" :size="28" />
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 8px; width: 100%;">
      <div
        v-for="name in icons"
        :key="name"
        style="display: flex; align-items: center; gap: 8px; min-width: 0; padding: 10px; border: 1px solid var(--line-1); border-radius: var(--r-6); color: var(--fg-2);"
      >
        <CfIcon :name="name" />
        <code style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ name }}</code>
      </div>
    </div>
  </div>
</template>
