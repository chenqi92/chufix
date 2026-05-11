import Preview from './ErrorNetwork.vue';
import previewSrc from './ErrorNetwork.vue?raw';
import previewReactSrc from './ErrorNetwork.tsx?raw';
import type { BlockMeta } from '../types';

export const errorNetwork: BlockMeta = {
  id: 'error-network',
  name: 'Error Network 网络异常',
  description: 'Result + 网络状态大插画 + 重试按钮（含 1.5s loading）+ 折叠诊断信息。',
  category: 'errors',
  height: 580,
  Preview,
  files: [
    { name: 'ErrorNetwork.vue', content: previewSrc, lang: 'vue' },
    { name: 'ErrorNetwork.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
