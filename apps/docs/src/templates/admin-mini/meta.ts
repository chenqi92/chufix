import type { TemplateMeta } from '../types';
import { vueFiles, reactFiles } from './source';

export const adminMini: TemplateMeta = {
  id: 'admin-mini',
  name: 'admin-mini · 后台管理',
  description:
    '最小化的后台管理工程：CfAppShell + CfNavMenu 左侧导航，用户管理 / 角色管理两页，Vue 与 React 双框架同源、TypeScript / JavaScript 双语言。',
  category: 'admin',
  vueFiles,
  reactFiles,
  workspaceTitle: 'admin-mini · source',
  workspaceRoot: 'admin-mini',
  workspaceHeight: 'min(620px, 70vh)',
};
