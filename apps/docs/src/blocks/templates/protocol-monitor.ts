import Preview from '~/components/demos/protocolpane/RealVue.vue';
import previewSrc from '~/components/demos/protocolpane/RealVue.vue?raw';
import type { BlockMeta } from '../types';

export const protocolMonitor: BlockMeta = {
  id: 'protocol-monitor',
  name: 'Protocol Monitor 协议监视器',
  description:
    'SSE / MQTT / Kafka / gRPC 4 个 tab 的协议监视面板，复用 CfTreeView / CfDataGrid / CfList 等 atoms 拼装。',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    {
      name: 'ProtocolMonitor.vue',
      content: previewSrc,
      lang: 'vue',
    },
  ],
};
