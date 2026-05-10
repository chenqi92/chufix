import Preview from './ProfilePage.vue';
import previewSrc from './ProfilePage.vue?raw';
import previewReactSrc from './ProfilePage.tsx?raw';
import type { BlockMeta } from '../types';

export const profilePage: BlockMeta = {
  id: 'profile-page',
  name: 'Profile Page 个人主页',
  description:
    'Avatar + Tag 组 + 4 个 Stat 数据 + Tabs 三段（概览 / 动态 / 仓库）+ 关注 / 发消息 操作。',
  category: 'profile',
  height: 720,
  Preview,
  files: [
    { name: 'ProfilePage.vue', content: previewSrc, lang: 'vue' },
    { name: 'ProfilePage.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
