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
    label: '组件总览',
    items: [
      { label: '所有组件', href: '/components/' },
      { label: 'Icon 图标', href: '/components/icon/' },
    ],
  },
  {
    label: '表单',
    items: [
      { label: 'Button 按钮', href: '/components/button/' },
      { label: 'Input 输入框', href: '/components/input/' },
      { label: 'Textarea 多行', href: '/components/textarea/' },
      { label: 'Select 选择器', href: '/components/select/' },
      { label: 'Switch 开关', href: '/components/switch/' },
      { label: 'Checkbox 复选框', href: '/components/checkbox/' },
      { label: 'Radio 单选框', href: '/components/radio/' },
      { label: 'SearchInput 搜索框', href: '/components/searchinput/' },
      { label: 'NumberInput 数字输入', href: '/components/numberinput/' },
      { label: 'Slider 滑块', href: '/components/slider/' },
      { label: 'InputGroup 输入组合', href: '/components/inputgroup/' },
      { label: 'OtpInput 一次性密码', href: '/components/otp/' },
      { label: 'Form 表单', href: '/components/form/' },
      { label: 'Combobox 组合选择', href: '/components/combobox/' },
      { label: 'TagInput 标签输入', href: '/components/taginput/' },
      { label: 'Dropzone 文件上传', href: '/components/dropzone/' },
      { label: 'ColorPicker 颜色选择', href: '/components/colorpicker/' },
      { label: 'DatePicker 日期选择', href: '/components/datepicker/' },
      { label: 'DateRangePicker 日期范围', href: '/components/daterangepicker/' },
      { label: 'KVEditor 键值编辑器', href: '/components/kveditor/' },
      { label: 'Mention 提及输入', href: '/components/mention/' },
      { label: 'Cascader 级联选择', href: '/components/cascader/' },
      { label: 'TimePicker 时间选择', href: '/components/timepicker/' },
      { label: 'Transfer 穿梭框', href: '/components/transfer/' },
      { label: 'TimeRangePicker 时间范围', href: '/components/timerangepicker/' },
    ],
  },
  {
    label: '容器',
    items: [
      { label: 'Card 卡片', href: '/components/card/' },
      { label: 'PageHeader 页头', href: '/components/pageheader/' },
      { label: 'AppShell 应用脚手架', href: '/components/appshell/' },
      { label: 'Splitter 分隔面板', href: '/components/splitter/' },
      { label: 'Calendar 日历', href: '/components/calendar/' },
    ],
  },
  {
    label: '数据展示',
    items: [
      { label: 'Tag 标签', href: '/components/tag/' },
      { label: 'Badge 徽标', href: '/components/badge/' },
      { label: 'Avatar 头像', href: '/components/avatar/' },
      { label: 'List 列表', href: '/components/list/' },
      { label: 'DescriptionList 描述列表', href: '/components/descriptionlist/' },
      { label: 'Stat / KPI 指标', href: '/components/stat/' },
      { label: 'Table 表格', href: '/components/table/' },
      { label: 'DataGrid 数据网格', href: '/components/datagrid/' },
      { label: 'TreeView 树形列表', href: '/components/treeview/' },
      { label: 'Kbd 键盘按键', href: '/components/kbd/' },
      { label: 'Link 链接', href: '/components/link/' },
      { label: 'Code 代码', href: '/components/code/' },
      { label: 'AspectRatio 宽高比', href: '/components/aspectratio/' },
      { label: 'Rating 评分', href: '/components/rating/' },
      { label: 'Toc 目录锚点', href: '/components/toc/' },
      { label: 'ScrollArea 滚动容器', href: '/components/scrollarea/' },
      { label: 'JsonViewer JSON 浏览', href: '/components/jsonviewer/' },
      { label: 'JsonDiff JSON 对比', href: '/components/jsondiff/' },
      { label: 'Kanban 看板', href: '/components/kanban/' },
      { label: 'Image 图片', href: '/components/image/' },
      { label: 'Carousel 轮播', href: '/components/carousel/' },
      { label: 'Statistic 统计数值', href: '/components/statistic/' },
      { label: 'Timeline 时间轴', href: '/components/timeline/' },
      { label: 'Marquee 跑马灯', href: '/components/marquee/' },
      { label: 'ImagePreview 大图预览', href: '/components/imagepreview/' },
      { label: 'Highlight 文本高亮', href: '/components/highlight/' },
      { label: 'TextEllipsis 多行省略', href: '/components/textellipsis/' },
      { label: 'CountDown 倒计时', href: '/components/countdown/' },
      { label: 'CalendarHeatmap 活跃热力', href: '/components/calendarheatmap/' },
      { label: 'QRCode 二维码', href: '/components/qrcode/' },
    ],
  },
  {
    label: '导航',
    items: [
      { label: 'Tabs 标签页', href: '/components/tabs/' },
      { label: 'SegmentedControl 分段控件', href: '/components/segmented/' },
      { label: 'Breadcrumb 面包屑', href: '/components/breadcrumb/' },
      { label: 'Pagination 分页', href: '/components/pagination/' },
      { label: 'Dropdown 下拉菜单', href: '/components/dropdown/' },
      { label: 'Stepper 步骤指示', href: '/components/stepper/' },
      { label: 'Sidebar 侧栏', href: '/components/sidebar/' },
      { label: 'NavMenu 主导航', href: '/components/navmenu/' },
      { label: 'Anchor 锚点导航', href: '/components/anchor/' },
    ],
  },
  {
    label: '反馈与覆盖层',
    items: [
      { label: 'Modal 弹窗', href: '/components/modal/' },
      { label: 'Tooltip 提示', href: '/components/tooltip/' },
      { label: 'Toast 通知', href: '/components/toast/' },
      { label: 'Alert 警示', href: '/components/alert/' },
      { label: 'Skeleton 骨架屏', href: '/components/skeleton/' },
      { label: 'Drawer 抽屉', href: '/components/drawer/' },
      { label: 'Popover 弹出层', href: '/components/popover/' },
      { label: 'Banner 全宽提示', href: '/components/banner/' },
      { label: 'Result 结果页', href: '/components/result/' },
    ],
  },
  {
    label: '布局与状态',
    items: [
      { label: 'Divider 分割线', href: '/components/divider/' },
      { label: 'Empty 空状态', href: '/components/empty/' },
      { label: 'Progress 进度', href: '/components/progress/' },
      { label: 'Spinner 加载', href: '/components/spinner/' },
      { label: 'Accordion 折叠面板', href: '/components/accordion/' },
      { label: 'BackTop 返回顶部', href: '/components/backtop/' },
      { label: 'Affix 固钉', href: '/components/affix/' },
      { label: 'Watermark 水印', href: '/components/watermark/' },
      { label: 'FloatButton 悬浮按钮', href: '/components/floatbutton/' },
      { label: 'InfiniteScroll 无限滚动', href: '/components/infinitescroll/' },
      { label: 'Tour 新手引导', href: '/components/tour/' },
    ],
  },
];
