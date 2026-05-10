import Preview from './AnalyticsBoard.vue';
import previewSrc from './AnalyticsBoard.vue?raw';
import type { BlockMeta } from '../types';

export const analyticsBoard: BlockMeta = {
  id: 'analytics-board',
  name: 'Analytics Board 数据分析看板',
  description:
    '4 个 Stat KPI + DonutChart 来源分布 + BarChart 每日转化 + StackedBar100 浏览器份额 + Treemap Bundle 分析。',
  category: 'dashboards',
  height: 760,
  Preview,
  files: [
    { name: 'AnalyticsBoard.vue', content: previewSrc, lang: 'vue' },
  ],
};
