<script setup lang="ts">
import { CfPivot } from '@chufix-design/vue';

interface Order {
  region: string;
  channel: string;
  amount: number;
}

const data: Order[] = [
  { region: '华北', channel: '官网', amount: 12400 },
  { region: '华北', channel: '门店', amount: 8200 },
  { region: '华北', channel: 'App', amount: 4900 },
  { region: '华东', channel: '官网', amount: 22800 },
  { region: '华东', channel: '门店', amount: 14200 },
  { region: '华东', channel: 'App', amount: 9800 },
  { region: '华南', channel: '官网', amount: 18200 },
  { region: '华南', channel: '门店', amount: 6800 },
  { region: '华南', channel: 'App', amount: 5400 },
  { region: '西部', channel: '官网', amount: 7400 },
  { region: '西部', channel: '门店', amount: 3200 },
  { region: '西部', channel: 'App', amount: 2100 },
];
</script>

<template>
  <CfPivot
    :data="data"
    row-field="region"
    col-field="channel"
    value-field="amount"
    aggregator="sum"
    :format="(v: number) => '¥' + v.toLocaleString()"
  />
</template>
