import Preview from './SettingsPage.vue';
import previewSrc from './SettingsPage.vue?raw';
import type { BlockMeta } from '../types';

export const settingsPage: BlockMeta = {
  id: 'settings-page',
  name: 'Settings Page 设置页',
  description:
    'Tabs 三段：个人资料（Avatar + Input + Textarea + Select）/ 通知（Switch 行）/ 安全（两步验证 + 危险操作）。',
  category: 'settings',
  height: 700,
  Preview,
  files: [
    { name: 'SettingsPage.vue', content: previewSrc, lang: 'vue' },
  ],
};
