import type { Locale } from '~/i18n/strings';

export const site = {
  title: 'ChuFix UI',
  nameZh: '础件',
  github: 'https://github.com/chenqi92/chufix',
  docsRepo: 'https://github.com/chenqi92/chufix',
  npm: 'https://www.npmjs.com/org/chufix-design',
  version: '0.2.1',
  status: {
    label: { zh: '开发预览', en: 'Preview' },
    updatedAt: '2026-05-10',
    npmPublished: true,
    announcementTitle: {
      zh: 'ChuFix UI 已发布到 npm',
      en: 'ChuFix UI is now published on npm',
    },
    announcement: {
      zh: '@chufix-design/{tokens,icons,vue,react,cli} 已发布 v0.2.1。新增授权 Blocks 与状态插画优化，TimelineGantt / Pivot / Spreadsheet 等能力持续增强。',
      en: '@chufix-design/{tokens,icons,vue,react,cli} v0.2.1 is live with new auth blocks, refined state artwork, and ongoing TimelineGantt / Pivot / Spreadsheet upgrades.',
    },
  },
};

export interface SidebarLink {
  label: { zh: string; en: string };
  href: string;
}

export interface SidebarGroup {
  label: { zh: string; en: string };
  items: SidebarLink[];
}

const L = (zh: string, en: string) => ({ zh, en });

// 单字段：组件英文名 = label 本身去除中文后缀
const c = (en: string, zh: string, slug: string): SidebarLink => ({
  label: { zh: `${en} ${zh}`, en },
  href: `/components/${slug}/`,
});

export const sidebar: SidebarGroup[] = [
  {
    label: L('开始', 'Getting started'),
    items: [
      { label: L('介绍', 'Introduction'), href: '/' },
      { label: L('安装', 'Installation'), href: '/getting-started/installation/' },
      { label: L('纯 HTML / JS 用法', 'Plain HTML / JS'), href: '/getting-started/vanilla/' },
      { label: L('主题与 Tokens', 'Theming & tokens'), href: '/getting-started/theming/' },
      { label: L('无障碍 a11y', 'Accessibility'), href: '/getting-started/accessibility/' },
    ],
  },
  {
    label: L('组件总览', 'Components overview'),
    items: [
      { label: L('所有组件', 'All components'), href: '/components/' },
      c('Icon', '图标', 'icon'),
    ],
  },
  {
    label: L('表单', 'Form'),
    items: [
      c('Button', '按钮', 'button'),
      c('IconButton', '图标按钮', 'iconbutton'),
      c('SplitButton', '分裂按钮', 'splitbutton'),
      c('Input', '输入框', 'input'),
      c('VariableAwareInput', '变量输入', 'variableinput'),
      c('PasswordStrength', '密码强度', 'passwordstrength'),
      c('PhoneInput', '电话号码', 'phoneinput'),
      c('Textarea', '多行', 'textarea'),
      c('Select', '选择器', 'select'),
      c('TreeSelect', '树形选择', 'treeselect'),
      c('Switch', '开关', 'switch'),
      c('Checkbox', '复选框', 'checkbox'),
      c('Radio', '单选框', 'radio'),
      c('SearchInput', '搜索框', 'searchinput'),
      c('NumberInput', '数字输入', 'numberinput'),
      c('Slider', '滑块', 'slider'),
      c('RangeSlider', '范围滑块', 'rangeslider'),
      c('ColorSwatch', '颜色块', 'colorswatch'),
      c('InputGroup', '输入组合', 'inputgroup'),
      c('OtpInput', '一次性密码', 'otp'),
      c('Form', '表单', 'form'),
      c('Combobox', '组合选择', 'combobox'),
      c('TagInput', '标签输入', 'taginput'),
      c('Dropzone', '文件拖拽', 'dropzone'),
      c('FilePicker', '文件选择', 'filepicker'),
      c('ColorPicker', '颜色选择', 'colorpicker'),
      c('IconPicker', '图标选择', 'iconpicker'),
      c('DatePicker', '日期选择', 'datepicker'),
      c('DateRangePicker', '日期范围', 'daterangepicker'),
      c('KVEditor', '键值编辑器', 'kveditor'),
      c('Mention', '提及输入', 'mention'),
      c('Cascader', '级联选择', 'cascader'),
      c('TimePicker', '时间选择', 'timepicker'),
      c('Transfer', '穿梭框', 'transfer'),
      c('TimeRangePicker', '时间范围', 'timerangepicker'),
    ],
  },
  {
    label: L('容器', 'Container'),
    items: [
      c('Flex', '弹性布局', 'flex'),
      c('Grid', '栅格', 'grid'),
      c('Card', '卡片', 'card'),
      c('PageHeader', '页头', 'pageheader'),
      c('AppShell', '应用脚手架', 'appshell'),
      c('Splitter', '分隔面板', 'splitter'),
      c('Toolbar', '工具栏', 'toolbar'),
      c('Calendar', '日历', 'calendar'),
    ],
  },
  {
    label: L('数据展示', 'Data display'),
    items: [
      c('Tag', '标签', 'tag'),
      c('Badge', '徽标', 'badge'),
      c('ProtocolBadge', '协议徽标', 'protocolbadge'),
      c('MethodBadge', 'HTTP 方法', 'methodbadge'),
      c('StatusCodeBadge', '状态码', 'statuscodebadge'),
      c('StatusIllustration', '状态插图', 'statusillustration'),
      c('Avatar', '头像', 'avatar'),
      c('List', '列表', 'list'),
      c('DescriptionList', '描述列表', 'descriptionlist'),
      { label: L('Stat / KPI 指标', 'Stat / KPI'), href: '/components/stat/' },
      c('Table', '表格', 'table'),
      c('DataGrid', '数据网格', 'datagrid'),
      c('Pivot', '透视表', 'pivot'),
      c('Spreadsheet', '表格编辑器', 'spreadsheet'),
      c('TreeView', '树形列表', 'treeview'),
      c('Kbd', '键盘按键', 'kbd'),
      c('Link', '链接', 'link'),
      c('Code', '代码', 'code'),
      c('AspectRatio', '宽高比', 'aspectratio'),
      c('Rating', '评分', 'rating'),
      c('Toc', '目录锚点', 'toc'),
      c('ScrollArea', '滚动容器', 'scrollarea'),
      c('JsonViewer', 'JSON 浏览', 'jsonviewer'),
      c('JsonDiff', 'JSON 对比', 'jsondiff'),
      c('Kanban', '看板', 'kanban'),
      c('Image', '图片', 'image'),
      c('Carousel', '轮播', 'carousel'),
      c('Statistic', '统计数值', 'statistic'),
      c('Timeline', '时间轴', 'timeline'),
      c('TimelineGantt', '甘特图', 'timelinegantt'),
      c('Marquee', '跑马灯', 'marquee'),
      c('ImagePreview', '大图预览', 'imagepreview'),
      c('Highlight', '文本高亮', 'highlight'),
      c('TextEllipsis', '多行省略', 'textellipsis'),
      c('CountDown', '倒计时', 'countdown'),
      c('CalendarHeatmap', '活跃热力', 'calendarheatmap'),
      c('QRCode', '二维码', 'qrcode'),
      c('Map', '地图', 'map'),
    ],
  },
  {
    label: L('导航', 'Navigation'),
    items: [
      c('Tabs', '标签页', 'tabs'),
      c('SegmentedControl', '分段控件', 'segmented'),
      c('Breadcrumb', '面包屑', 'breadcrumb'),
      c('Pagination', '分页', 'pagination'),
      c('Dropdown', '下拉菜单', 'dropdown'),
      c('Stepper', '步骤指示', 'stepper'),
      c('Sidebar', '侧栏', 'sidebar'),
      c('NavMenu', '主导航', 'navmenu'),
      c('Anchor', '锚点导航', 'anchor'),
    ],
  },
  {
    label: L('反馈与覆盖层', 'Feedback & overlays'),
    items: [
      c('Modal', '弹窗', 'modal'),
      c('ConfirmDialog', '确认弹窗', 'confirmdialog'),
      c('Tooltip', '提示', 'tooltip'),
      c('HoverCard', '悬停卡片', 'hovercard'),
      c('Toast', '通知', 'toast'),
      c('Snackbar', '底部通知', 'snackbar'),
      c('Alert', '警示', 'alert'),
      c('Skeleton', '骨架屏', 'skeleton'),
      c('Drawer', '抽屉', 'drawer'),
      c('Popover', '弹出层', 'popover'),
      c('ContextMenu', '右键菜单', 'contextmenu'),
      c('CommandPalette', '命令面板', 'commandpalette'),
      c('Banner', '全宽提示', 'banner'),
      c('Result', '结果页', 'result'),
    ],
  },
  {
    label: L('布局与状态', 'Layout & state'),
    items: [
      c('Divider', '分割线', 'divider'),
      c('Empty', '空状态', 'empty'),
      c('Progress', '进度', 'progress'),
      c('Spinner', '加载中', 'spinner'),
      c('Accordion', '折叠面板', 'accordion'),
      c('BackTop', '返回顶部', 'backtop'),
      c('Affix', '固钉', 'affix'),
      c('Watermark', '水印', 'watermark'),
      c('FloatButton', '悬浮按钮', 'floatbutton'),
      c('InfiniteScroll', '无限滚动', 'infinitescroll'),
      c('Tour', '新手引导', 'tour'),
    ],
  },
  {
    label: L('编辑器', 'Editors'),
    items: [
      c('CodeEditor', '代码编辑', 'codeeditor'),
      c('DiffEditor', '文本对比', 'diffeditor'),
      c('MarkdownEditor', 'Markdown', 'markdowneditor'),
      c('RegexBuilder', '正则构建', 'regexbuilder'),
      c('AnsiText', 'ANSI 文本', 'ansitext'),
    ],
  },
  {
    label: L('系统壳层', 'System shell'),
    items: [
      c('TitleBar', '标题栏', 'titlebar'),
      c('StatusBar', '状态栏', 'statusbar'),
      c('MenuBar', '菜单栏', 'menubar'),
      c('NotificationCenter', '通知中心', 'notificationcenter'),
      c('GlobalSearch', '全局搜索', 'globalsearch'),
    ],
  },
  {
    label: L('多窗口布局', 'Multi-window layout'),
    items: [
      c('DockLayout', '多面板布局', 'docklayout'),
      c('DetachedPanel', '浮动面板', 'detachedpanel'),
      c('FloatingInspector', '浮动检查器', 'floatinginspector'),
      c('TearOffTabs', '可撕离 Tab', 'tearofftab'),
    ],
  },
];

/** 选 sidebar 当前 locale 的 label，方便 component 内 `pickLabel(item.label, locale)`。*/
export function pickLabel<T extends { zh: string; en: string }>(field: T, locale: Locale): string {
  return field[locale] ?? field.zh;
}
