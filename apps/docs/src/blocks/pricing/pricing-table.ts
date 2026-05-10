import Preview from './PricingTable.vue';
import previewSrc from './PricingTable.vue?raw';
import previewReactSrc from './PricingTable.tsx?raw';
import type { BlockMeta } from '../types';

export const pricingTable: BlockMeta = {
  id: 'pricing-table',
  name: 'Pricing Table 价格方案',
  description:
    '3 档方案 (Free / Pro / Enterprise) + 月付/年付切换 + Pro 高亮 + 功能复选 + CTA 按钮。',
  category: 'pricing',
  height: 720,
  Preview,
  files: [
    { name: 'PricingTable.vue', content: previewSrc, lang: 'vue' },
    { name: 'PricingTable.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
