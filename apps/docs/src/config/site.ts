export const site = {
  title: 'ChuKit UI',
  tagline: '初见即用的基础组件库',
  description: 'Vue 3 与 React 双框架同源的基础组件库，类 shadcn 体验。',
  github: 'https://github.com/chenqi92/chukit',
  docsRepo: 'https://github.com/chenqi92/chukit-docs',
  version: '0.0.1',
};

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarLink[];
}

export const sidebar: SidebarGroup[] = [
  {
    label: '开始',
    items: [
      { label: '介绍', href: '/' },
      { label: '安装', href: '/getting-started/installation/' },
      { label: '主题与 Tokens', href: '/getting-started/theming/' },
    ],
  },
  {
    label: '组件',
    items: [
      { label: '总览', href: '/components/' },
      { label: 'Button 按钮', href: '/components/button/' },
      { label: 'Input 输入框', href: '/components/input/' },
      { label: 'Card 卡片', href: '/components/card/' },
      { label: 'Switch 开关', href: '/components/switch/' },
      { label: 'Modal 弹窗', href: '/components/modal/' },
    ],
  },
];
