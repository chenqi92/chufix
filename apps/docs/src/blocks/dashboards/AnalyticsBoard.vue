<script setup lang="ts">
import {
  CfDonutChart,
  CfBarChart,
  CfTreemap,
  CfStat,
  CfStackedBar100,
} from '@chufix/vue';

const sources = [
  { name: 'Search', value: 4280 },
  { name: 'Direct', value: 2240 },
  { name: 'Social', value: 1820 },
  { name: 'Email', value: 940 },
  { name: 'Other', value: 720 },
];

const conversions = [42, 68, 35, 91, 57, 78, 23, 64, 49, 72];
const conversionsLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

const bundleNodes = [
  { name: 'react-dom', value: 1200 },
  { name: 'react', value: 720 },
  { name: 'lodash', value: 540 },
  { name: 'moment', value: 480 },
  { name: 'rxjs', value: 380 },
  { name: 'd3', value: 320 },
  { name: 'others', value: 600 },
];

const browsers = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge', value: 5 },
  { name: 'Other', value: 3 },
];
</script>

<template>
  <div class="board">
    <header class="board__head">
      <h2>Analytics</h2>
      <p>过去 7 天的访问与转化分布</p>
    </header>

    <section class="board__stats">
      <CfStat label="总访问" value="9,300" trend="up" :delta="12.4" />
      <CfStat label="独立访客" value="6,712" trend="up" :delta="3.8" />
      <CfStat label="跳出率" value="42.1" suffix="%" trend="down" :delta="-1.4" />
      <CfStat label="平均停留" value="3:42" trend="flat" />
    </section>

    <section class="board__row board__row--3">
      <div class="board__card">
        <h3>来源分布</h3>
        <CfDonutChart :segments="sources" :size="180" :thickness="22" />
      </div>
      <div class="board__card">
        <h3>每日转化</h3>
        <CfBarChart :data="conversions" :labels="conversionsLabel" :height="200" />
      </div>
      <div class="board__card">
        <h3>浏览器份额</h3>
        <CfStackedBar100 :segments="browsers" />
      </div>
    </section>

    <section class="board__card">
      <h3>Bundle 分析 · 4.2 MB</h3>
      <CfTreemap :nodes="bundleNodes" :height="220" />
    </section>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-sans);
}
.board__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.board__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.board__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.board__row {
  display: grid;
  gap: 12px;
}
.board__row--3 {
  grid-template-columns: repeat(3, 1fr);
}
.board__card {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  padding: 14px 16px;
}
.board__card h3 {
  margin: 0 0 10px;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
</style>
