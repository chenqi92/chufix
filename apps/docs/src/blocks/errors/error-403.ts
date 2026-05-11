import Preview from './Error403.vue';
import previewSrc from './Error403.vue?raw';
import previewReactSrc from './Error403.tsx?raw';
import type { BlockMeta } from '../types';

export const error403: BlockMeta = {
  id: 'error-403',
  name: 'Error 403 无权限',
  description: 'Result(403) + 主题化权限插画 + Banner 说明所需角色 + 申请权限 / 切换账号双操作。',
  category: 'errors',
  height: 580,
  Preview,
  files: [
    { name: 'Error403.vue', content: previewSrc, lang: 'vue' },
    { name: 'Error403.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
