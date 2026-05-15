<script setup lang="ts">
import { CfFlamegraph, type FlameNode } from '@chufix-design/vue';

const data: FlameNode = {
  name: 'request handler',
  value: 240,
  children: [
    {
      name: 'auth middleware',
      value: 28,
      category: 'auth',
      children: [
        { name: 'verify jwt', value: 18, category: 'auth' },
        { name: 'load user', value: 10, category: 'db' },
      ],
    },
    {
      name: 'controller',
      value: 180,
      children: [
        {
          name: 'fetch entries',
          value: 110,
          category: 'db',
          children: [
            { name: 'SELECT entries', value: 80, category: 'db' },
            { name: 'SELECT tags', value: 30, category: 'db' },
          ],
        },
        {
          name: 'render',
          value: 70,
          category: 'render',
          children: [
            { name: 'template walk', value: 40, category: 'render' },
            { name: 'serialize json', value: 30, category: 'render' },
          ],
        },
      ],
    },
    { name: 'logger', value: 12, category: 'logging' },
    { name: 'response.send', value: 20, category: 'io' },
  ],
};
</script>

<template>
  <CfFlamegraph :data="data" />
</template>
