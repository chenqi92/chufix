import Preview from './DeviceAuthorization.vue';
import previewSrc from './DeviceAuthorization.vue?raw';
import previewReactSrc from './DeviceAuthorization.tsx?raw';
import type { BlockMeta } from '../types';

export const deviceAuthorization: BlockMeta = {
  id: 'device-authorization',
  name: 'Device Authorization 设备授权',
  description:
    '设备码授权页：展示设备码、过期进度、设备信息、风险提示，并支持确认授权 / 复制代码 / 拒绝。',
  category: 'auth',
  height: 720,
  Preview,
  files: [
    { name: 'DeviceAuthorization.vue', content: previewSrc, lang: 'vue' },
    { name: 'DeviceAuthorization.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
