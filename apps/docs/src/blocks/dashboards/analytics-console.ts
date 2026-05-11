import Preview from './AnalyticsConsole.vue';
import previewSrc from './AnalyticsConsole.vue?raw';
import previewReactSrc from './AnalyticsConsole.tsx?raw';
import type { BlockMeta } from '../types';

export const analyticsConsole: BlockMeta = {
  id: 'analytics-console',
  name: 'Analytics Console 销售分析看板',
  description:
    'Pivot 透视 + 热力图 + 单元格 drill-down 到 Drawer 看明细。可切换聚合方式 / 行字段 / 列字段；点格子触发 modal.confirm 重置数据。把 0.2.0 新增的 Pivot 和 Drawer v2 串起来跑。',
  category: 'dashboards',
  height: 920,
  Preview,
  files: [
    { name: 'AnalyticsConsole.vue', content: previewSrc, lang: 'vue' },
    { name: 'AnalyticsConsole.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
