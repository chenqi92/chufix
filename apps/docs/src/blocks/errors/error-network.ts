import Preview from './ErrorNetwork.vue';
import previewSrc from './ErrorNetwork.vue?raw';
import type { BlockMeta } from '../types';

export const errorNetwork: BlockMeta = {
  id: 'error-network',
  name: 'Error Network 网络异常',
  description: 'Result + 重试按钮（含 1.5s loading）+ 折叠诊断信息（CfDescriptionList）。',
  category: 'errors',
  height: 580,
  Preview,
  files: [
    { name: 'ErrorNetwork.vue', content: previewSrc, lang: 'vue' },
  ],
};
