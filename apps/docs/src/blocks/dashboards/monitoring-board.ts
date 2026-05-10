import Preview from './MonitoringBoard.vue';
import previewSrc from './MonitoringBoard.vue?raw';
import previewReactSrc from './MonitoringBoard.tsx?raw';
import type { BlockMeta } from '../types';

export const monitoringBoard: BlockMeta = {
  id: 'monitoring-board',
  name: 'Monitoring Board 运维监视大屏',
  description:
    '4 个 Gauge 资源仪表 + LatencyHeatmap 一周 × 24h 热力图 + 服务健康列表（Sparkline + 可用率 + 状态码）。',
  category: 'dashboards',
  height: 760,
  Preview,
  files: [
    { name: 'MonitoringBoard.vue', content: previewSrc, lang: 'vue' },
    { name: 'MonitoringBoard.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
