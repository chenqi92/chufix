export const site = {
  title: 'ChuFix UI',
  tagline: '初见即用的基础组件库',
  description: 'Vue 3 与 React 双框架同源的基础组件库，可装包也可拷源码。',
  github: 'https://github.com/chenqi92/chufix',
  docsRepo: 'https://github.com/chenqi92/chufix-docs',
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
      { label: 'Checkbox 复选框', href: '/components/checkbox/' },
      { label: 'Radio 单选框', href: '/components/radio/' },
      { label: 'Textarea 多行', href: '/components/textarea/' },
      { label: 'Select 选择器', href: '/components/select/' },
      { label: 'Modal 弹窗', href: '/components/modal/' },
      { label: 'Tooltip 提示', href: '/components/tooltip/' },
      { label: 'Toast 通知', href: '/components/toast/' },
      { label: 'Tag 标签', href: '/components/tag/' },
      { label: 'Badge 徽标', href: '/components/badge/' },
      { label: 'Avatar 头像', href: '/components/avatar/' },
    ],
  },
];
