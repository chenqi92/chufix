export const site = {
  title: 'ChuFix UI',
  nameZh: '础件',
  tagline: '初见即用的基础组件库',
  description: '础件 ChuFix UI · 初见即用的基础组件库，Vue 3 与 React 双框架同源，纯 HTML/JS 项目也能直接用 CSS 类名。',
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
      { label: '纯 HTML / JS 用法', href: '/getting-started/vanilla/' },
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
      { label: 'Tabs 标签页', href: '/components/tabs/' },
      { label: 'Alert 警示', href: '/components/alert/' },
      { label: 'Skeleton 骨架屏', href: '/components/skeleton/' },
    ],
  },
];
