<script setup lang="ts">
import { CfMapTile, CfMapScale } from '@chufix-design/maps-vue';
</script>

<template>
  <CfMapTile
    :center="{ lng: 116.4, lat: 39.9 }"
    :zoom="6"
    :width="560"
    :height="320"
  >
    <CfMapScale position="bottom-left" unit="metric" />
    <CfMapScale position="bottom-right" unit="imperial" />
  </CfMapTile>
</template>
