import Preview from './LoginBasic.vue';
import previewSrc from './LoginBasic.vue?raw';
import previewReactSrc from './LoginBasic.tsx?raw';
import type { BlockMeta } from '../types';

export const loginBasic: BlockMeta = {
  id: 'login-basic',
  name: 'Login Basic 登录',
  description:
    'Card + Input + Checkbox + Button + Link 拼装的标准登录页。含 GitHub 第三方登录槽与"忘记密码 / 立即注册"链接。',
  category: 'auth',
  height: 560,
  Preview,
  files: [
    { name: 'LoginBasic.vue', content: previewSrc, lang: 'vue' },
    { name: 'LoginBasic.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
