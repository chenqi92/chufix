import Preview from './RegisterMultiStep.vue';
import previewSrc from './RegisterMultiStep.vue?raw';
import previewReactSrc from './RegisterMultiStep.tsx?raw';
import type { BlockMeta } from '../types';

export const registerMultistep: BlockMeta = {
  id: 'register-multistep',
  name: 'Register Multi-Step 多步注册',
  description:
    'Stepper 3 步引导：账号（含 PasswordStrength）→ 个人（含 PhoneInput）→ 协议同意。每步有进入前置校验。',
  category: 'auth',
  height: 720,
  Preview,
  files: [
    { name: 'RegisterMultiStep.vue', content: previewSrc, lang: 'vue' },
    { name: 'RegisterMultiStep.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
