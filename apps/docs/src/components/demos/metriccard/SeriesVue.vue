<script setup lang="ts">
import { ref } from 'vue';
import { CfMetricCard, CfTag, toast } from '@chufix-design/vue';

const channels = [
  { label: '官网', value: '4,820', suffix: ' 万', delta: 8.2, trend: [120, 140, 158, 162, 180, 200, 220], color: 'var(--viz-1, oklch(64% 0.16 263))' },
  { label: '门店', value: '3,140', suffix: ' 万', delta: 2.4, trend: [80, 86, 92, 96, 100, 108, 112], color: 'var(--viz-2, oklch(70% 0.13 175))' },
  { label: 'App', value: '2,680', suffix: ' 万', delta: 14.6, trend: [60, 70, 88, 102, 118, 130, 142], color: 'var(--viz-3, oklch(74% 0.16 80))' },
  { label: '分销', value: '1,420', suffix: ' 万', delta: -4.1, trend: [80, 76, 72, 68, 64, 60, 58], color: 'var(--viz-4, oklch(64% 0.18 30))' },
];

const lastSelected = ref<string>('');

function onSelect(p: { index: number; item: { label: string; value: string | number } }) {
  lastSelected.value = `${p.item.label} (#${p.index + 1}) → ${p.item.value}`;
  toast({ type: 'info', message: `点击 ${p.item.label}` });
}
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 640px;">
    <CfMetricCard
      label="本月营收"
      value="12,060"
      suffix=" 万"
      :delta="6.4"
      :trend="[820, 880, 920, 1020, 1140, 1180, 1206]"
      hint="点 chevron 展开,点行下钻"
      :series="channels"
      default-expanded
      @series-select="onSelect"
    />
    <CfMetricCard
      label="DAU"
      value="318"
      suffix="K"
      :delta="3.2"
      :trend="[260, 268, 275, 282, 296, 308, 318]"
      hint="无 series 时不渲染 chevron"
    />
  </div>
  <p style="margin-top: 8px; font-size: 12px;">
    <CfTag tone="info" size="sm">点击渠道</CfTag>
    {{ lastSelected || '尚未点击' }}
  </p>
</template>
