import Preview from './DashboardOverview.vue';
import previewSrc from './DashboardOverview.vue?raw';
import previewReactSrc from './DashboardOverview.tsx?raw';
import type { BlockMeta } from '../types';

export const dashboardOverview: BlockMeta = {
  id: 'dashboard-overview',
  name: 'Dashboard Overview 管理后台首页',
  description:
    '4 个 KPI MetricCard + LineChart 趋势 + DonutChart 占比 + DataGrid 最近请求。常用作 SaaS 后台首页。',
  category: 'dashboards',
  height: 720,
  Preview,
  files: [
    { name: 'DashboardOverview.vue', content: previewSrc, lang: 'vue' },
    { name: 'DashboardOverview.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
