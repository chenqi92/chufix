<script setup lang="ts">
import { ref } from 'vue';
import { CfSnackbar, CfButton } from '@chufix-design/vue';
import type { SnackbarPlacement } from '@chufix-design/vue';
const open = ref(false);
const placement = ref<SnackbarPlacement>('bottom-center');
function show(p: SnackbarPlacement) {
  placement.value = p;
  open.value = false;
  setTimeout(() => { open.value = true; }, 50);
}
const placements: SnackbarPlacement[] = [
  'bottom-center', 'bottom-left', 'bottom-right',
  'top-center', 'top-left', 'top-right',
];
</script>

<template>
  <div>
    <div class="demo-row" style="flex-wrap: wrap;">
      <CfButton v-for="p in placements" :key="p" size="sm" @click="show(p)">{{ p }}</CfButton>
    </div>
    <CfSnackbar
      v-model:open="open"
      :placement="placement"
      tone="info"
      :message="`Placement: ${placement}`"
    />
  </div>
</template>
