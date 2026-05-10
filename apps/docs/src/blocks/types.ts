import type { Component } from 'vue';

export type BlockCategory =
  | 'templates'
  | 'dashboards'
  | 'auth'
  | 'errors'
  | 'workbench'
  | 'settings';

export interface BlockFile {
  name: string;
  content: string;
  lang: 'vue' | 'tsx' | 'ts' | 'js' | 'json' | 'css' | 'bash' | 'mdx';
}

export interface BlockMeta {
  id: string;
  name: string;
  description: string;
  category: BlockCategory;
  /** Optional CLI install hint, e.g. `npx chufix add dashboard-overview`. */
  cli?: string;
  /** Suggested preview height (px). */
  height?: number;
  /** The live preview Vue component. */
  Preview: Component;
  /** Source files shown in code view; first file is highlighted by default. */
  files: BlockFile[];
}

export interface BlockCategoryDef {
  id: BlockCategory;
  label: string;
  description: string;
}

export const CATEGORIES: BlockCategoryDef[] = [
  { id: 'templates', label: 'Templates 模版', description: '8 个预设 Tabs 壳：协议监视 / 网络抓包 / SQL 工作台 / 终端 / 崩溃 / 插件 / API 调试 / 引导流' },
  { id: 'dashboards', label: 'Dashboards 仪表盘', description: '管理后台首页、运维大屏、分析看板、高管摘要' },
  { id: 'auth', label: 'Auth 鉴权', description: '登录 / 注册 / OTP 验证完整页' },
  { id: 'errors', label: 'Errors 错误页', description: '404 / 403 / 500 / 网络异常占位' },
  { id: 'workbench', label: 'Workbench 工作台', description: '代码编辑器 / 数据库工具的完整 IDE 风格组合' },
  { id: 'settings', label: 'Settings 设置页', description: '个人 / 团队 / 安全设置组合' },
];
