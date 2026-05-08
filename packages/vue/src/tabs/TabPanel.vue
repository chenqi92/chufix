<script setup lang="ts">
import { inject } from 'vue';
defineProps<{ value: string; label?: string; disabled?: boolean }>();
/* TabPanel relies on the parent Tabs scoped-slot exposing `active`;
 * consumers wrap content in <template #default="{ active }"> and gate with
 *   <TabPanel v-show="active === 'foo'" value="foo">…</TabPanel>
 * The label/disabled props are read by Tabs to build the tab list. */
</script>

<template>
  <div class="cf-tabs__panel" role="tabpanel">
    <slot />
  </div>
</template>
