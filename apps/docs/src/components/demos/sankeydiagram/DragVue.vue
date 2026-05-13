<script setup lang="ts">
import { ref } from 'vue';
import { CfSankeyDiagram, CfTag } from '@chufix-design/vue';

const nodes = [
  { id: 'src-organic', name: '自然搜索', layer: 0, colorIndex: 0 },
  { id: 'src-paid', name: '广告投放', layer: 0, colorIndex: 1 },
  { id: 'src-social', name: '社交分享', layer: 0, colorIndex: 2 },
  { id: 'lp-home', name: '首页', layer: 1, colorIndex: 3 },
  { id: 'lp-product', name: '产品页', layer: 1, colorIndex: 4 },
  { id: 'lp-blog', name: '博客', layer: 1, colorIndex: 5 },
  { id: 'cv-trial', name: '试用注册', layer: 2, colorIndex: 6 },
  { id: 'cv-purchase', name: '直接购买', layer: 2, colorIndex: 7 },
];

const links = [
  { source: 'src-organic', target: 'lp-home', value: 240 },
  { source: 'src-organic', target: 'lp-product', value: 180 },
  { source: 'src-organic', target: 'lp-blog', value: 80 },
  { source: 'src-paid', target: 'lp-home', value: 140 },
  { source: 'src-paid', target: 'lp-product', value: 220 },
  { source: 'src-social', target: 'lp-blog', value: 120 },
  { source: 'src-social', target: 'lp-home', value: 60 },
  { source: 'lp-home', target: 'cv-trial', value: 220 },
  { source: 'lp-home', target: 'cv-purchase', value: 60 },
  { source: 'lp-product', target: 'cv-trial', value: 160 },
  { source: 'lp-product', target: 'cv-purchase', value: 200 },
  { source: 'lp-blog', target: 'cv-trial', value: 90 },
];

const lastDrag = ref<string>('');
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    任意节点上按住竖直拖拽即可手动重排该层顺序;所有连线实时跟随。
  </p>
  <CfSankeyDiagram
    :nodes="nodes"
    :links="links"
    :width="640"
    :height="320"
    :node-width="14"
    @node-drag="(p: { node: { name: string }; deltaY: number }) => lastDrag = `${p.node.name} ${p.deltaY > 0 ? '↓' : '↑'} ${Math.abs(Math.round(p.deltaY))}px`"
  />
  <p style="margin-top: 8px; font-size: 12px;">
    <CfTag tone="info" size="sm">last drag</CfTag>
    {{ lastDrag || '尚未拖拽' }}
  </p>
</template>
