// 工程方案（Templates）：多文件、多页面组合的完整工程示例。
// 与 Blocks（单页面拼装）平级：blocks 提供单页菜谱，templates 提供整套工程。

import type { Component } from 'vue';

export type TemplateCategory =
  | 'admin'
  | 'commerce'
  | 'content'
  | 'tooling';

export interface TemplateMeta {
  id: string;
  /** 显示名称，例如 "admin-mini · 后台管理"。 */
  name: string;
  /** 一句话描述，gallery 卡片上的副标题。 */
  description: string;
  category: TemplateCategory;
  /** 实时演示用的 Vue 组件入口。点开详情页后渲染。 */
  Preview?: Component;
  /** Vue 源文件，TypeScript 写法；JS 变体由 buildWorkspaceBundles 自动生成。 */
  vueFiles?: Record<string, string>;
  /** React 源文件,TypeScript 写法（仅用于源码面板展示，不参与运行）。 */
  reactFiles?: Record<string, string>;
  /** 详情页源码面板顶部 title。缺省时用 `${id} · source`。 */
  workspaceTitle?: string;
  /** 详情页源码面板根目录名。缺省时用 `id`。 */
  workspaceRoot?: string;
  /** 详情页源码面板高度。缺省 'min(620px, 70vh)'。 */
  workspaceHeight?: string;
  /** 详情页实时演示区高度。缺省 'min(780px, 88vh)'。 */
  previewHeight?: string;
}

export interface TemplateCategoryDef {
  id: TemplateCategory;
  label: string;
  description: string;
}

export const CATEGORIES: TemplateCategoryDef[] = [
  { id: 'admin', label: 'Admin 后台管理', description: '管理后台、控制台类多页面工程' },
  { id: 'commerce', label: 'Commerce 电商', description: '前台 / 商家后台 / 订单流程类工程' },
  { id: 'content', label: 'Content 内容站', description: '博客、文档、知识库类工程' },
  { id: 'tooling', label: 'Tooling 工具', description: '调试器、可视化编辑器类工程' },
];
