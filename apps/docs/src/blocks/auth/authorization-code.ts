import Preview from './AuthorizationCode.vue';
import previewSrc from './AuthorizationCode.vue?raw';
import previewReactSrc from './AuthorizationCode.tsx?raw';
import type { BlockMeta } from '../types';

export const authorizationCode: BlockMeta = {
  id: 'authorization-code',
  name: 'Authorization Code 授权码',
  description:
    'OAuth 授权码 consent 页：展示应用身份、redirect_uri、scope 勾选、允许 / 拒绝和授权码签发态。',
  category: 'auth',
  height: 760,
  Preview,
  files: [
    { name: 'AuthorizationCode.vue', content: previewSrc, lang: 'vue' },
    { name: 'AuthorizationCode.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
