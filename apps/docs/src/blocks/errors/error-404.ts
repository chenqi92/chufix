import Preview from './Error404.vue';
import previewSrc from './Error404.vue?raw';
import previewReactSrc from './Error404.tsx?raw';
import type { BlockMeta } from '../types';

export const error404: BlockMeta = {
  id: 'error-404',
  name: 'Error 404 页面未找到',
  description: 'Result(404) + StatusIllustration(not-found) + 主操作 / 次操作 + 常见入口链接。',
  category: 'errors',
  height: 540,
  Preview,
  files: [
    { name: 'Error404.vue', content: previewSrc, lang: 'vue' },
    { name: 'Error404.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
