<script setup lang="ts">
import { ref } from 'vue';
import { CfColorSwatch } from '@chufix-design/vue';
const picked = ref('var(--accent-1)');
const colors = ['var(--accent-1)', 'var(--status-success)', 'var(--status-warning)', 'var(--status-error)', 'var(--proto-ws)', 'var(--proto-gql)'];
</script>

<template>
  <div class="demo-row">
    <CfColorSwatch
      v-for="c in colors"
      :key="c"
      :color="c"
      :selected="picked === c"
      :label="c"
      @click="picked = c"
    />
    <CfColorSwatch add label="添加颜色" />
  </div>
</template>
