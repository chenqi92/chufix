import Preview from './LoginOtp.vue';
import previewSrc from './LoginOtp.vue?raw';
import previewReactSrc from './LoginOtp.tsx?raw';
import type { BlockMeta } from '../types';

export const loginOtp: BlockMeta = {
  id: 'login-otp',
  name: 'Login OTP 短信验证登录',
  description:
    'PhoneInput 国家码 + OtpInput 6 位验证码 + 60s 倒计时重发。code 输满 6 位时自动 submit。',
  category: 'auth',
  height: 560,
  Preview,
  files: [
    { name: 'LoginOtp.vue', content: previewSrc, lang: 'vue' },
    { name: 'LoginOtp.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
