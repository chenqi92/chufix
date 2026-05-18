import type { Locale } from '~/i18n/strings';
import vuePackage from '../../../../packages/vue/package.json';

const componentVersion = vuePackage.version;

export const site = {
  title: 'ChuFix UI',
  nameZh: '础件',
  github: 'https://github.com/chenqi92/chufix',
  docsRepo: 'https://github.com/chenqi92/chufix/tree/main/apps/docs',
  npm: 'https://www.npmjs.com/org/chufix-design',
  version: componentVersion,
  status: {
    label: { zh: '开发预览', en: 'Preview' },
    updatedAt: '2026-05-10',
    npmPublished: true,
    announcementTitle: {
      zh: 'ChuFix UI 已发布到 npm',
      en: 'ChuFix UI is now published on npm',
    },
    announcement: {
      zh: '@chufix-design/{tokens,icons,vue,react,cli} 已发布。新增授权 Blocks 与状态插画优化，TimelineGantt / Pivot / Spreadsheet 等能力持续增强。',
      en: '@chufix-design/{tokens,icons,vue,react,cli} is live with new auth blocks, refined state artwork, and ongoing TimelineGantt / Pivot / Spreadsheet upgrades.',
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
    label: L('工具函数', 'Utilities'),
    items: [
      { label: L('Composables & Hooks', 'Composables & Hooks'), href: '/utilities/composables/' },
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
      c('ButtonGroup', '按钮组', 'buttongroup'),
      c('ToggleGroup', '切换组', 'togglegroup'),
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
      c('Typography', '文本', 'typography'),
      c('Editable', '行内编辑', 'editable'),
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
  {
    label: L('数据 / 列表', 'Data & lists'),
    items: [
      c('VirtualList', '虚拟列表', 'virtuallist'),
      c('VirtualGrid', '虚拟网格', 'virtualgrid'),
      c('TreeTable', '树形表格', 'treetable'),
      c('Masonry', '瀑布流', 'masonry'),
      c('FilterPanel', '筛选侧栏', 'filterpanel'),
      c('BulkSelectionBar', '批量操作条', 'bulkselectionbar'),
      c('ColumnVisibilityMenu', '列设置', 'columnvisibilitymenu'),
      c('SpeedDial', '速拨按钮', 'speeddial'),
    ],
  },
  {
    label: L('AI 对话', 'AI chat'),
    items: [
      c('ChatList', '对话列表', 'chatlist'),
      c('ChatBubble', '对话气泡', 'chatbubble'),
      c('PromptComposer', '提示输入', 'promptcomposer'),
      c('StreamingText', '流式文本', 'streamingtext'),
      c('ThinkingTrace', '推理过程', 'thinkingtrace'),
      c('ToolCallCard', '工具调用', 'toolcallcard'),
      c('ArtifactCard', '产物卡片', 'artifactcard'),
      c('CitationMark', '引用标记', 'citationmark'),
      c('ModelPicker', '模型选择', 'modelpicker'),
      c('TokenMeter', '上下文用量', 'tokenmeter'),
    ],
  },
  {
    label: L('移动端 / 触控', 'Mobile & touch'),
    items: [
      c('BottomSheet', '底部弹层', 'bottomsheet'),
      c('PullToRefresh', '下拉刷新', 'pulltorefresh'),
      c('SwipeAction', '滑动操作', 'swipeaction'),
      c('Fab', '主操作按钮', 'fab'),
      c('TabBar', '底部导航', 'tabbar'),
    ],
  },
  {
    label: L('表单进阶', 'Form advanced'),
    items: [
      c('FieldRow', '字段行', 'fieldrow'),
      c('FormGrid', '表单栅格', 'formgrid'),
      c('FormSection', '表单分组', 'formsection'),
      c('FormSchema', 'Schema 表单', 'formschema'),
    ],
  },
  {
    label: L('地图扩展', 'Map extras'),
    items: [
      c('MapMiniMap', '缩略地图', 'mapminimap'),
      c('ChoroplethMap', '分级填色', 'choroplethmap'),
      c('FlowMap', '迁徙地图', 'flowmap'),
    ],
  },
  {
    label: L('交互地图', 'Interactive map'),
    items: [
      c('MapTile', '瓦片地图', 'maptile'),
      c('BubbleMap', '气泡地图', 'bubblemap'),
      c('HeatMap', '地理热力', 'heatmap'),
      c('MarkerCluster', '标记聚合', 'markercluster'),
      c('MapLegend', '图例', 'maplegend'),
      c('MapScale', '比例尺', 'mapscale'),
      c('Terrain3D', '3D 地形', 'terrain3d'),
    ],
  },
  {
    label: L('拖拽 / Drag & Drop', 'Drag & Drop'),
    items: [
      c('Sortable', '排序列表', 'sortable'),
      c('Draggable', '可拖拽容器', 'draggable'),
      c('Droppable', '放置目标', 'droppable'),
      c('DragLayer', '拖拽预览层', 'draglayer'),
      c('ReorderTable', '重排表格', 'reordertable'),
    ],
  },
  {
    label: L('媒体 / 标注', 'Media & Annotation'),
    items: [
      c('SignaturePad', '签名板', 'signaturepad'),
      c('DrawingCanvas', '画板', 'drawingcanvas'),
      c('ImageAnnotator', '图像标注', 'imageannotator'),
      c('HotspotImage', '图像热区', 'hotspotimage'),
      c('AudioPlayer', '音频播放器', 'audioplayer'),
      c('VideoPlayer', '视频播放器', 'videoplayer'),
    ],
  },
  {
    label: L('开发者工具', 'Developer Tools'),
    items: [
      c('Flamegraph', '火焰图', 'flamegraph'),
      c('LogViewer', '日志面板', 'logviewer'),
      c('Terminal', '终端展示', 'terminal'),
      c('QueryBuilder', '查询构造器', 'querybuilder'),
      c('NetworkInspector', '网络面板', 'networkinspector'),
      c('RequestTimeline', '请求时序', 'requesttimeline'),
    ],
  },
  {
    label: L('协作 / Agent 可视化', 'Collaboration & Agent'),
    items: [
      c('PresenceAvatars', '在线用户行', 'presenceavatars'),
      c('RemoteCursor', '远端光标', 'remotecursor'),
      c('TypingIndicator', '输入中', 'typingindicator'),
      c('PulseDot', '脉冲指示', 'pulsedot'),
      c('PlanCard', '计划卡片', 'plancard'),
      c('ReasoningTree', '思考树', 'reasoningtree'),
      c('AgentTimeline', '代理时间线', 'agenttimeline'),
    ],
  },
  {
    label: L('数据可视化 · 时序', 'Charts · Time series'),
    items: [
      c('LineChart', '折线图', 'linechart'),
      c('AreaChart', '面积图', 'areachart'),
      c('Sparkline', '缩略走势', 'sparkline'),
      c('CandlestickChart', 'K 线图', 'candlestickchart'),
    ],
  },
  {
    label: L('数据可视化 · 分类', 'Charts · Category'),
    items: [
      c('BarChart', '柱状图', 'barchart'),
      c('Histogram', '直方图', 'histogram'),
      c('StackedBar100', '占比柱', 'stackedbar100'),
      c('BulletChart', '子弹图', 'bulletchart'),
      c('WaterfallChart', '瀑布图', 'waterfallchart'),
      c('ParetoChart', '帕累托图', 'paretochart'),
      c('PolarBarChart', '极坐标柱', 'polarbarchart'),
      c('TornadoChart', '龙卷风图', 'tornadochart'),
    ],
  },
  {
    label: L('数据可视化 · 对比与组合', 'Charts · Compare & combo'),
    items: [
      c('DualAxisChart', '双轴组合', 'dualaxischart'),
      c('SlopeChart', '斜率图', 'slopechart'),
      c('MarimekkoChart', '马赛克图', 'marimekkochart'),
      c('StreamGraph', '河流图', 'streamgraph'),
      c('VennDiagram', '韦恩图', 'venndiagram'),
      c('ParallelCoordinates', '平行坐标', 'parallelcoordinates'),
      c('WordCloud', '词云', 'wordcloud'),
    ],
  },
  {
    label: L('数据可视化 · 占比', 'Charts · Composition'),
    items: [
      c('DonutChart', '环形图', 'donutchart'),
      c('FunnelChart', '漏斗图', 'funnelchart'),
      c('Treemap', '矩形树图', 'treemap'),
      c('SankeyDiagram', '流向图', 'sankeydiagram'),
      c('SunburstChart', '旭日图', 'sunburstchart'),
      c('ChordDiagram', '弦图', 'chorddiagram'),
    ],
  },
  {
    label: L('数据可视化 · 多维', 'Charts · Multi-dim'),
    items: [
      c('ScatterPlot', '散点图', 'scatterplot'),
      c('BoxPlot', '箱线图', 'boxplot'),
      c('ViolinPlot', '小提琴图', 'violinplot'),
      c('RadarChart', '雷达图', 'radarchart'),
      c('RidgePlot', '密度脊图', 'ridgeplot'),
      c('Hexbin', '六边形热图', 'hexbin'),
      c('CorrelationMatrix', '相关性矩阵', 'correlationmatrix'),
      c('PyramidChart', '金字塔图', 'pyramidchart'),
    ],
  },
  {
    label: L('数据可视化 · 单值与性能', 'Charts · Single & perf'),
    items: [
      c('Gauge', '仪表盘', 'gauge'),
      c('LiquidFill', '液体填充', 'liquidfill'),
      c('MetricCard', '指标卡', 'metriccard'),
      c('TimingBar', '请求瀑布', 'timingbar'),
      c('LatencyHeatmap', '延迟热力', 'latencyheatmap'),
      c('HeatmapChart', '通用热力', 'heatmapchart'),
      c('ConnectionGraph', '连接图', 'connectiongraph'),
      c('ArcDiagram', '弧线图', 'arcdiagram'),
    ],
  },
  {
    label: L('数据可视化 · 工具', 'Charts · Helpers'),
    items: [
      c('ChartToolbar', '图表工具栏', 'charttoolbar'),
      c('ChartCrosshair', '十字线', 'chartcrosshair'),
    ],
  },
];

/** 选 sidebar 当前 locale 的 label，方便 component 内 `pickLabel(item.label, locale)`。*/
export function pickLabel<T extends { zh: string; en: string }>(field: T, locale: Locale): string {
  return field[locale] ?? field.zh;
}
