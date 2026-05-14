<script setup lang="ts">
import { CfMapTile, CfMapScale } from '@chufix-design/vue';
</script>

<template>
  <CfMapTile
    :center="{ lng: 116.4, lat: 39.9 }"
    :zoom="4"
    :width="560"
    :height="320"
  >
    <CfMapScale position="bottom-left" />
  </CfMapTile>
</template>
