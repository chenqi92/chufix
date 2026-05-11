import Preview from './ExecutiveSummary.vue';
import previewSrc from './ExecutiveSummary.vue?raw';
import previewReactSrc from './ExecutiveSummary.tsx?raw';
import type { BlockMeta } from '../types';

export const executiveSummary: BlockMeta = {
  id: 'executive-summary',
  name: 'Executive Summary 高管摘要',
  description:
    '4 个大字号 KPI（ARR / MAU / NPS / LTV）+ Sparkline 趋势。适合做季度月会的幻灯片首页。',
  category: 'dashboards',
  height: 520,
  Preview,
  files: [
    { name: 'ExecutiveSummary.vue', content: previewSrc, lang: 'vue' },
    { name: 'ExecutiveSummary.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
