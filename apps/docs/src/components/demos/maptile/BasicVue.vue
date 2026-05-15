<script setup lang="ts">
import { CfMapTile, CfMapScale } from '@chufix-design/maps-vue';
</script>

<template>
  <CfMapTile
    :center="{ lng: 116.4, lat: 39.9 }"
    :zoom="4"
    :width="720"
    :height="520"
  >
    <CfMapScale position="bottom-left" />
  </CfMapTile>
</template>
