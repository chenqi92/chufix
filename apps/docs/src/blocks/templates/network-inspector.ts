import Preview from '~/components/demos/networkpane/RealVue.vue';
import previewSrc from '~/components/demos/networkpane/RealVue.vue?raw';
import previewReactSrc from './NetworkInspector.tsx?raw';
import type { BlockMeta } from '../types';

export const networkInspector: BlockMeta = {
  id: 'network-inspector',
  name: 'Network Inspector 网络面板',
  description: 'HAR / Hex / PCAP / Cert / Cookie 5 个 tab 的网络抓包面板',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    { name: 'NetworkInspector.vue', content: previewSrc, lang: 'vue' },
    { name: 'NetworkInspector.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
