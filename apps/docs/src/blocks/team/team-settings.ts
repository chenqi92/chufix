import Preview from './TeamSettings.vue';
import previewSrc from './TeamSettings.vue?raw';
import previewReactSrc from './TeamSettings.tsx?raw';
import type { BlockMeta } from '../types';

export const teamSettings: BlockMeta = {
  id: 'team-settings',
  name: 'Team Settings 团队成员管理',
  description:
    '邀请栏（邮箱 + 角色 Select + 邀请按钮）+ DataGrid 成员列表（Avatar + Tag + 状态 + Dropdown 操作）。',
  category: 'team',
  height: 640,
  Preview,
  files: [
    { name: 'TeamSettings.vue', content: previewSrc, lang: 'vue' },
    { name: 'TeamSettings.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
