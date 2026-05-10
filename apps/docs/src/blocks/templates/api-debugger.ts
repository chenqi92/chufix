import Preview from '~/components/demos/domainpane/RealVue.vue';
import previewSrc from '~/components/demos/domainpane/RealVue.vue?raw';
import type { BlockMeta } from '../types';

export const apiDebugger: BlockMeta = {
  id: 'api-debugger',
  name: 'API Debugger API 调试器',
  description: 'Collection / Request / Response / Mock / Workflow 5 个 tab 的 API 调试面板（Postman 雏形）',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    {
      name: 'ApiDebugger.vue',
      content: previewSrc,
      lang: 'vue',
    },
  ],
};
