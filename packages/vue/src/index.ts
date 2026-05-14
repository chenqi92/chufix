import '@chufix-design/tokens/tokens.css';
import './styles/a11y.css';
import './styles/icon.css';
import './styles/statusillustration.css';
import './styles/button.css';
import './styles/buttongroup.css';
import './styles/togglegroup.css';
import './styles/typography.css';
import './styles/editable.css';
import './styles/heatmapchart.css';
import './styles/waterfallchart.css';
import './styles/sunburstchart.css';
import './styles/iconbutton.css';
import './styles/toolbar.css';
import './styles/colorswatch.css';
import './styles/splitbutton.css';
import './styles/confirmdialog.css';
import './styles/hovercard.css';
import './styles/contextmenu.css';
import './styles/snackbar.css';
import './styles/passwordstrength.css';
import './styles/phoneinput.css';
import './styles/rangeslider.css';
import './styles/filepicker.css';
import './styles/commandpalette.css';
import './styles/protocolbadge.css';
import './styles/statuscodebadge.css';
import './styles/variableinput.css';
import './styles/codeeditor.css';
import './styles/diffeditor.css';
import './styles/markdowneditor.css';
import './styles/regexbuilder.css';
import './styles/ansitext.css';
import './styles/titlebar.css';
import './styles/statusbar.css';
import './styles/menubar.css';
import './styles/notificationcenter.css';
import './styles/globalsearch.css';
import './styles/docklayout.css';
import './styles/detachedpanel.css';
import './styles/floatinginspector.css';
import './styles/tearofftab.css';
import './styles/templatepane.css';
import './styles/charts.css';
import './styles/dualaxischart.css';
import './styles/paretochart.css';
import './styles/slopechart.css';
import './styles/polarbarchart.css';
import './styles/marimekkochart.css';
import './styles/tornadochart.css';
import './styles/wordcloud.css';
import './styles/venndiagram.css';
import './styles/streamgraph.css';
import './styles/parallelcoordinates.css';
import './styles/input.css';
import './styles/flex.css';
import './styles/grid.css';
import './styles/card.css';
import './styles/switch.css';
import './styles/checkbox.css';
import './styles/radio.css';
import './styles/textarea.css';
import './styles/select.css';
import './styles/treeselect.css';
import './styles/iconpicker.css';
import './styles/tooltip.css';
import './styles/toast.css';
import './styles/tag.css';
import './styles/badge.css';
import './styles/avatar.css';
import './styles/modal.css';
import './styles/tabs.css';
import './styles/alert.css';
import './styles/skeleton.css';
import './styles/divider.css';
import './styles/empty.css';
import './styles/progress.css';
import './styles/breadcrumb.css';
import './styles/pagination.css';
import './styles/spinner.css';
import './styles/searchinput.css';
import './styles/numberinput.css';
import './styles/accordion.css';
import './styles/slider.css';
import './styles/drawer.css';
import './styles/popover.css';
import './styles/dropdown.css';
import './styles/inputgroup.css';
import './styles/otp.css';
import './styles/form.css';
import './styles/combobox.css';
import './styles/taginput.css';
import './styles/dropzone.css';
import './styles/colorpicker.css';
import './styles/datepicker.css';
import './styles/banner.css';
import './styles/pageheader.css';
import './styles/stepper.css';
import './styles/splitter.css';
import './styles/appshell.css';
import './styles/sidebar.css';
import './styles/navmenu.css';
import './styles/list.css';
import './styles/descriptionlist.css';
import './styles/stat.css';
import './styles/table.css';
import './styles/treeview.css';
import './styles/datagrid.css';
import './styles/kbd.css';
import './styles/link.css';
import './styles/code.css';
import './styles/aspectratio.css';
import './styles/rating.css';
import './styles/toc.css';
import './styles/scrollarea.css';
import './styles/kveditor.css';
import './styles/jsonviewer.css';
import './styles/jsondiff.css';
import './styles/calendar.css';
import './styles/kanban.css';
import './styles/mention.css';
import './styles/backtop.css';
import './styles/affix.css';
import './styles/watermark.css';
import './styles/image.css';
import './styles/timeline.css';
import './styles/timelinegantt.css';
import './styles/pivot.css';
import './styles/spreadsheet.css';
import './styles/result.css';
import './styles/statistic.css';
import './styles/carousel.css';
import './styles/cascader.css';
import './styles/marquee.css';
import './styles/floatbutton.css';
import './styles/anchor.css';
import './styles/imagepreview.css';
import './styles/timepicker.css';
import './styles/transfer.css';
import './styles/highlight.css';
import './styles/textellipsis.css';
import './styles/countdown.css';
import './styles/infinitescroll.css';
import './styles/timerangepicker.css';
import './styles/calendarheatmap.css';
import './styles/tour.css';
import './styles/qrcode.css';
import './styles/bottomsheet.css';
import './styles/pulltorefresh.css';
import './styles/swipeaction.css';
import './styles/fab.css';
import './styles/tabbar.css';
import './styles/streamingtext.css';
import './styles/citationmark.css';
import './styles/tokenmeter.css';
import './styles/chatbubble.css';
import './styles/modelpicker.css';
import './styles/thinkingtrace.css';
import './styles/toolcallcard.css';
import './styles/artifactcard.css';
import './styles/chatlist.css';
import './styles/promptcomposer.css';
import './styles/speeddial.css';
import './styles/bulkselectionbar.css';
import './styles/columnvisibilitymenu.css';
import './styles/masonry.css';
import './styles/virtuallist.css';
import './styles/virtualgrid.css';
import './styles/treetable.css';
import './styles/filterpanel.css';
import './styles/fieldrow.css';
import './styles/formgrid.css';
import './styles/formsection.css';
import './styles/formschema.css';

/* All component exports use the Cf prefix (matching the CSS `cf-` class
 * prefix; `cf` from chufix) so consumers can keep the imported name in
 * their template and disambiguate against other UI libraries. Want short
 * names? Alias on import: `import { CfButton as Button } from '@chufix-design/vue'`. */

export { default as CfButton } from './button/Button.vue';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonShape } from './button/variants';

export { default as CfButtonGroup } from './buttongroup/ButtonGroup.vue';
export type {
  ButtonGroupProps,
  ButtonGroupOrientation,
  ButtonGroupSize,
  ButtonGroupVariant,
} from './buttongroup/variants';

export { default as CfHeading } from './typography/Heading.vue';
export { default as CfText } from './typography/Text.vue';
export { default as CfParagraph } from './typography/Paragraph.vue';
export { default as CfEditable } from './editable/Editable.vue';
export type { EditableProps, EditableSize, EditableCommitPayload } from './editable/variants';
export type {
  HeadingProps,
  HeadingLevel,
  TextProps,
  TextSize,
  TextVariant,
  TextWeight,
  TextAlign,
  ParagraphProps,
} from './typography/variants';

export { default as CfToggleGroup } from './togglegroup/ToggleGroup.vue';
export type {
  ToggleGroupProps,
  ToggleGroupMode,
  ToggleGroupOrientation,
  ToggleGroupSize,
  ToggleGroupVariant,
  ToggleOption,
  ToggleGroupChangePayload,
} from './togglegroup/variants';

export { default as CfIconButton } from './iconbutton/IconButton.vue';
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
  IconButtonShape,
} from './iconbutton/variants';

export { default as CfStatusIllustration } from './statusillustration/StatusIllustration.vue';
export type {
  StatusIllustrationProps,
  StatusIllustrationSize,
  StatusIllustrationVariant,
} from './statusillustration/variants';

export { default as CfToolbar } from './toolbar/Toolbar.vue';
export { default as CfToolbarSeparator } from './toolbar/ToolbarSeparator.vue';
export type {
  ToolbarProps,
  ToolbarVariant,
  ToolbarSize,
  ToolbarOrientation,
} from './toolbar/variants';

export { default as CfColorSwatch } from './colorswatch/ColorSwatch.vue';
export type {
  ColorSwatchProps,
  ColorSwatchSize,
  ColorSwatchShape,
} from './colorswatch/variants';

export { default as CfSplitButton } from './splitbutton/SplitButton.vue';
export type {
  SplitButtonProps,
  SplitButtonItem,
  SplitButtonVariant,
  SplitButtonSize,
} from './splitbutton/variants';

export { default as CfConfirmDialog } from './confirmdialog/ConfirmDialog.vue';
export type {
  ConfirmDialogProps,
  ConfirmTone,
} from './confirmdialog/variants';

export { default as CfHoverCard } from './hovercard/HoverCard.vue';
export type {
  HoverCardProps,
  HoverCardPlacement,
  HoverCardSize,
} from './hovercard/variants';

export { default as CfContextMenu } from './contextmenu/ContextMenu.vue';
export type {
  ContextMenuProps,
  ContextMenuItem,
} from './contextmenu/variants';

export { default as CfSnackbar } from './snackbar/Snackbar.vue';
export type {
  SnackbarProps,
  SnackbarTone,
  SnackbarPlacement,
} from './snackbar/variants';

export { default as CfPasswordStrength } from './passwordstrength/PasswordStrength.vue';
export type {
  PasswordStrengthProps,
  PasswordStrengthSize,
  PasswordRequirement,
  StrengthLevel,
} from './passwordstrength/variants';
export { defaultRequirements as defaultPasswordRequirements } from './passwordstrength/variants';

export { default as CfPhoneInput } from './phoneinput/PhoneInput.vue';
export type {
  PhoneInputProps,
  PhoneInputSize,
  CountryCode,
} from './phoneinput/variants';
export { defaultCountries } from './phoneinput/variants';

export { default as CfRangeSlider } from './rangeslider/RangeSlider.vue';
export type {
  RangeSliderProps,
  RangeSliderSize,
  RangeSliderTone,
  RangeValue,
} from './rangeslider/variants';

export { default as CfFilePicker } from './filepicker/FilePicker.vue';
export type {
  FilePickerProps,
  FilePickerSize,
  FilePickerVariant,
} from './filepicker/variants';

export { default as CfCommandPalette } from './commandpalette/CommandPalette.vue';
export type {
  CommandPaletteProps,
  CommandPaletteItem,
} from './commandpalette/variants';

export { default as CfProtocolBadge } from './protocolbadge/ProtocolBadge.vue';
/** Alias of CfProtocolBadge for HTTP-method-only contexts. */
export { default as CfMethodBadge } from './protocolbadge/ProtocolBadge.vue';
export type {
  ProtocolBadgeProps,
  ProtocolBadgeSize,
  ProtocolKind,
} from './protocolbadge/variants';

export { default as CfStatusCodeBadge } from './statuscodebadge/StatusCodeBadge.vue';
export type {
  StatusCodeBadgeProps,
  StatusCodeBadgeSize,
  StatusClass,
} from './statuscodebadge/variants';

export { default as CfVariableAwareInput } from './variableinput/VariableAwareInput.vue';
export type {
  VariableAwareInputProps,
  VariableAwareInputSize,
  VariableAwareInputScope,
  VariableAwareInputVariable,
  VariableAwareInputVariableOption,
  NormalizedVariableOption as VariableAwareInputOption,
  VariableAwareInputVariant,
  Token as VariableAwareInputToken,
  VariableToken as VariableAwareInputVariableToken,
  VariableAwareInputVariableEvent,
  VariableAwareInputVariableUpdate,
} from './variableinput/variants';

export { default as CfCodeEditor } from './codeeditor/CodeEditor.vue';
export type {
  CodeEditorProps,
  CodeEditorSize,
} from './codeeditor/variants';

export { default as CfDiffEditor } from './diffeditor/DiffEditor.vue';
export type {
  DiffEditorProps,
  DiffEditorSize,
  DiffEditorMode,
  DiffOp as DiffEditorOp,
  DiffRow as DiffEditorRow,
} from './diffeditor/variants';

export { default as CfMarkdownEditor } from './markdowneditor/MarkdownEditor.vue';
export type {
  MarkdownEditorProps,
  MarkdownEditorSize,
  MarkdownEditorMode,
} from './markdowneditor/variants';
export { renderMarkdown as renderMarkdownDefault } from './markdowneditor/variants';

export { default as CfRegexBuilder } from './regexbuilder/RegexBuilder.vue';
export type {
  RegexBuilderProps,
  RegexBuilderSize,
  RegexFlag,
  RegexMatch,
  RegexResult,
} from './regexbuilder/variants';

export { default as CfAnsiText } from './ansitext/AnsiText.vue';
export type {
  AnsiTextProps,
  AnsiTextSize,
  AnsiSpan,
} from './ansitext/variants';

export { default as CfTitleBar } from './titlebar/TitleBar.vue';
export type {
  TitleBarProps,
  TitleBarPlatform,
  TitleBarSize,
} from './titlebar/variants';

export { default as CfStatusBar } from './statusbar/StatusBar.vue';
export type {
  StatusBarProps,
  StatusBarItem,
  StatusBarTone,
  StatusBarSize,
} from './statusbar/variants';

export { default as CfMenuBar } from './menubar/MenuBar.vue';
export type {
  MenuBarProps,
  MenuBarMenu,
  MenuBarItem,
} from './menubar/variants';

export { default as CfNotificationCenter } from './notificationcenter/NotificationCenter.vue';
export type {
  NotificationCenterProps,
  NotificationItem,
  NotificationTone,
} from './notificationcenter/variants';

export { default as CfGlobalSearch } from './globalsearch/GlobalSearch.vue';
export type {
  GlobalSearchProps,
  GlobalSearchResult,
} from './globalsearch/variants';

export { default as CfDockLayout } from './docklayout/DockLayout.vue';
export { default as CfDockNode } from './docklayout/DockNode.vue';
export type {
  DockLayoutProps,
  DockGroup,
  DockPanel,
  DockOrientation,
} from './docklayout/variants';

export { default as CfDetachedPanel } from './detachedpanel/DetachedPanel.vue';
export type { DetachedPanelProps } from './detachedpanel/variants';

export { default as CfFloatingInspector } from './floatinginspector/FloatingInspector.vue';
export type {
  FloatingInspectorProps,
  InspectorPlacement,
} from './floatinginspector/variants';

export { default as CfTearOffTabs } from './tearofftab/TearOffTabs.vue';
export type {
  TearOffTabsProps,
  TearOffTabItem,
} from './tearofftab/variants';

/* ── Template panes (Cf<Domain>Pane) — page-module shells with predefined Tabs + slots. ── */
export { default as CfProtocolPane } from './templatepanes/ProtocolPane.vue';
export { default as CfNetworkPane } from './templatepanes/NetworkPane.vue';
export { default as CfSqlWorkbench } from './templatepanes/SqlWorkbench.vue';
export { default as CfTerminalPane } from './templatepanes/TerminalPane.vue';
export { default as CfCrashPane } from './templatepanes/CrashPane.vue';
export { default as CfPluginPane } from './templatepanes/PluginPane.vue';
export { default as CfDomainPane } from './templatepanes/DomainPane.vue';
export { default as CfOnboardingFlow } from './templatepanes/OnboardingFlow.vue';
export type {
  TemplatePaneProps,
  TemplatePaneTab,
} from './templatepanes/variants';
export {
  PROTOCOL_TABS,
  NETWORK_TABS,
  SQL_TABS,
  TERMINAL_TABS,
  CRASH_TABS,
  PLUGIN_TABS,
  DOMAIN_TABS,
  ONBOARDING_TABS,
} from './templatepanes/variants';

/* ── Data viz · 22 chart components ── */
export { default as CfSparkline } from './sparkline/Sparkline.vue';
export type { SparklineProps } from './sparkline/variants';

export { default as CfLineChart } from './linechart/LineChart.vue';
export type { LineChartProps, LineSeries } from './linechart/variants';

export { default as CfAreaChart } from './areachart/AreaChart.vue';
export type { AreaChartProps, AreaSeries } from './areachart/variants';

export { default as CfBarChart } from './barchart/BarChart.vue';
export type { BarChartProps } from './barchart/variants';

export { default as CfHistogram } from './histogram/Histogram.vue';
export type { HistogramProps, HistogramBin } from './histogram/variants';

export { default as CfStackedBar100 } from './stackedbar100/StackedBar100.vue';
export type {
  StackedBar100Props,
  StackedBar100Series,
} from './stackedbar100/variants';

export { default as CfBulletChart } from './bulletchart/BulletChart.vue';
export type { BulletChartProps } from './bulletchart/variants';

export { default as CfCandlestickChart } from './candlestickchart/CandlestickChart.vue';
export type {
  CandlestickChartProps,
  Candle,
} from './candlestickchart/variants';

export { default as CfDonutChart } from './donutchart/DonutChart.vue';
export type { DonutChartProps, DonutSegment } from './donutchart/variants';

export { default as CfFunnelChart } from './funnelchart/FunnelChart.vue';
export type { FunnelChartProps, FunnelStep } from './funnelchart/variants';

export { default as CfTreemap } from './treemap/Treemap.vue';
export type { TreemapProps, TreemapNode } from './treemap/variants';

export { default as CfSankeyDiagram } from './sankeydiagram/SankeyDiagram.vue';
export type {
  SankeyDiagramProps,
  SankeyNode,
  SankeyLink,
} from './sankeydiagram/variants';

export { default as CfScatterPlot } from './scatterplot/ScatterPlot.vue';
export type { ScatterPlotProps, ScatterPoint } from './scatterplot/variants';

export { default as CfBoxPlot } from './boxplot/BoxPlot.vue';
export type { BoxPlotProps, BoxStat } from './boxplot/variants';

export { default as CfRadarChart } from './radarchart/RadarChart.vue';
export type { RadarChartProps, RadarSeries } from './radarchart/variants';

export { default as CfRidgePlot } from './ridgeplot/RidgePlot.vue';
export type { RidgePlotProps, RidgeRow } from './ridgeplot/variants';

export { default as CfGauge } from './gauge/Gauge.vue';
export type { GaugeProps } from './gauge/variants';

export { default as CfMetricCard } from './metriccard/MetricCard.vue';
export type { MetricCardProps } from './metriccard/variants';

export { default as CfTimingBar } from './timingbar/TimingBar.vue';
export type { TimingBarProps, TimingPhase } from './timingbar/variants';

export { default as CfLatencyHeatmap } from './latencyheatmap/LatencyHeatmap.vue';
export type { LatencyHeatmapProps } from './latencyheatmap/variants';

export { default as CfHeatmapChart } from './heatmapchart/HeatmapChart.vue';
export type {
  HeatmapChartProps,
  HeatmapColorScale,
  HeatmapChartInteractionPayload,
} from './heatmapchart/variants';

export { default as CfWaterfallChart } from './waterfallchart/WaterfallChart.vue';
export type {
  WaterfallChartProps,
  WaterfallStep,
  WaterfallStepKind,
  WaterfallChartInteractionPayload,
} from './waterfallchart/variants';

export { default as CfSunburstChart } from './sunburstchart/SunburstChart.vue';
export type {
  SunburstChartProps,
  SunburstNode,
  SunburstChartInteractionPayload,
} from './sunburstchart/variants';

export { default as CfConnectionGraph } from './connectiongraph/ConnectionGraph.vue';
export type {
  ConnectionGraphProps,
  GraphNode,
  GraphEdge,
} from './connectiongraph/variants';

export { default as CfChartCrosshair } from './chartcrosshair/ChartCrosshair.vue';
export type { ChartCrosshairProps } from './chartcrosshair/variants';

export { default as CfChartToolbar } from './charttoolbar/ChartToolbar.vue';
export type {
  ChartToolbarProps,
  LegendSeries,
} from './charttoolbar/variants';

export { default as CfDualAxisChart } from './dualaxischart/DualAxisChart.vue';
export type {
  DualAxisProps,
  DualAxisSize,
  DualAxisHoverPayload,
} from './dualaxischart/variants';

export { default as CfParetoChart } from './paretochart/ParetoChart.vue';
export type {
  ParetoProps,
  ParetoItem,
  ParetoSize,
  ParetoHoverPayload,
} from './paretochart/variants';

export { default as CfSlopeChart } from './slopechart/SlopeChart.vue';
export type {
  SlopeProps,
  SlopeItem,
  SlopeSize,
  SlopeHoverPayload,
} from './slopechart/variants';

export { default as CfPolarBarChart } from './polarbarchart/PolarBarChart.vue';
export type {
  PolarBarProps,
  PolarBarItem,
  PolarBarSize,
  PolarBarHoverPayload,
} from './polarbarchart/variants';

export { default as CfMarimekkoChart } from './marimekkochart/MarimekkoChart.vue';
export type {
  MarimekkoProps,
  MarimekkoColumn,
  MarimekkoSegment,
  MarimekkoSize,
  MarimekkoHoverPayload,
} from './marimekkochart/variants';

export { default as CfTornadoChart } from './tornadochart/TornadoChart.vue';
export type {
  TornadoProps,
  TornadoItem,
  TornadoSize,
  TornadoHoverPayload,
} from './tornadochart/variants';

export { default as CfWordCloud } from './wordcloud/WordCloud.vue';
export type {
  WordCloudProps,
  WordCloudItem,
  WordCloudSize,
  WordCloudHoverPayload,
} from './wordcloud/variants';

export { default as CfVennDiagram } from './venndiagram/VennDiagram.vue';
export type {
  VennProps,
  VennSet,
  VennIntersection,
  VennSize,
  VennHoverPayload,
} from './venndiagram/variants';

export { default as CfStreamGraph } from './streamgraph/StreamGraph.vue';
export type {
  StreamGraphProps,
  StreamSeries,
  StreamGraphSize,
  StreamGraphHoverPayload,
} from './streamgraph/variants';

export { default as CfParallelCoordinates } from './parallelcoordinates/ParallelCoordinates.vue';
export type {
  ParallelProps,
  ParallelAxis,
  ParallelItem,
  ParallelSize,
  ParallelHoverPayload,
} from './parallelcoordinates/variants';

export { default as CfInput } from './input/Input.vue';
export type { InputProps, InputVariant, InputSize } from './input/variants';

export { default as CfFlex } from './flex/Flex.vue';
export type {
  FlexProps,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexGap,
} from './flex/variants';

export { default as CfGrid } from './grid/Grid.vue';
export { default as CfRow } from './grid/Row.vue';
export { default as CfCol } from './grid/Col.vue';
export type {
  GridProps,
  GridGap,
  GridAlign,
  GridJustify,
  RowProps,
  RowJustify,
  RowAlign,
  RowGutter,
  ColProps,
  ColBreakpoint,
  ColBreakpointConfig,
} from './grid/variants';

export { default as CfCard } from './card/Card.vue';
export type { CardProps, CardVariant } from './card/variants';

export { default as CfSwitch } from './switch/Switch.vue';
export type { SwitchChangeMeta, SwitchProps, SwitchSize } from './switch/variants';

export { default as CfCheckbox } from './checkbox/Checkbox.vue';
export type {
  CheckboxChangeMeta,
  CheckboxProps,
  CheckboxSize,
} from './checkbox/variants';

export { default as CfRadio } from './radio/Radio.vue';
export { default as CfRadioGroup } from './radio/RadioGroup.vue';
export type {
  RadioProps,
  RadioGroupProps,
  RadioSize,
  RadioValue,
  RadioChangeMeta,
} from './radio/variants';

export { default as CfTextarea } from './textarea/Textarea.vue';
export type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaResize,
} from './textarea/variants';

export { default as CfSelect } from './select/Select.vue';
export type {
  SelectProps,
  SelectOption,
  SelectVariant,
  SelectSize,
  SelectValue,
} from './select/variants';

export { default as CfTreeSelect } from './treeselect/TreeSelect.vue';
export type {
  TreeSelectProps,
  TreeSelectNode,
  TreeSelectSize,
} from './treeselect/variants';

export { default as CfIconPicker } from './iconpicker/IconPicker.vue';
export type { IconPickerProps, IconPickerSize } from './iconpicker/variants';

export { default as CfTooltip } from './tooltip/Tooltip.vue';
export type { TooltipProps, TooltipPlacement } from './tooltip/variants';

export { default as CfToaster } from './toast/Toaster.vue';
export { toast, toastStore } from './toast/store';
export type { ToastItem, ToastInput, ToastType } from './toast/store';

export { default as CfTag } from './tag/Tag.vue';
export type { TagProps, TagVariant, TagSize, TagTone } from './tag/variants';

export { default as CfBadge } from './badge/Badge.vue';
export type {
  BadgeProps,
  BadgeTone,
  BadgePlacement,
} from './badge/variants';

export { default as CfAvatar } from './avatar/Avatar.vue';
export { default as CfAvatarGroup } from './avatar/AvatarGroup.vue';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarSize,
  AvatarShape,
} from './avatar/variants';

export { default as CfModal } from './modal/Modal.vue';
export type { ModalProps, ModalSize, ModalTone, FooterAlign } from './modal/variants';
export { modal } from './modal/service';
export type { ModalServiceOptions } from './modal/service';

export { default as CfTabs } from './tabs/Tabs.vue';
export { default as CfTabPanel } from './tabs/TabPanel.vue';
export type {
  TabsProps,
  TabsItem,
  TabsVariant,
  TabsSize,
  TabsAlign,
} from './tabs/variants';

export { default as CfAlert } from './alert/Alert.vue';
export type { AlertProps, AlertTone, AlertVariant } from './alert/variants';

export { default as CfSkeleton } from './skeleton/Skeleton.vue';
export type { SkeletonProps, SkeletonShape } from './skeleton/variants';

export { default as CfDivider } from './divider/Divider.vue';
export type {
  DividerProps,
  DividerOrientation,
  DividerVariant,
} from './divider/variants';

export { default as CfEmpty } from './empty/Empty.vue';
export type { EmptyProps, EmptySize } from './empty/variants';

export { default as CfProgress } from './progress/Progress.vue';
export type {
  ProgressProps,
  ProgressVariant,
  ProgressTone,
  ProgressSize,
} from './progress/variants';

export { default as CfBreadcrumb } from './breadcrumb/Breadcrumb.vue';
export type { BreadcrumbProps, BreadcrumbItem } from './breadcrumb/variants';

export { default as CfPagination } from './pagination/Pagination.vue';
export type { PaginationProps, PaginationSize } from './pagination/variants';

export { default as CfSpinner } from './spinner/Spinner.vue';
export type { SpinnerProps, SpinnerSize, SpinnerTone } from './spinner/variants';

export { default as CfSearchInput } from './searchinput/SearchInput.vue';
export type { SearchInputProps, SearchInputSize } from './searchinput/variants';

export { default as CfNumberInput } from './numberinput/NumberInput.vue';
export type { NumberInputProps, NumberInputSize } from './numberinput/variants';

export { default as CfAccordion } from './accordion/Accordion.vue';
export type {
  AccordionProps,
  AccordionItem,
  AccordionMode,
  AccordionVariant,
} from './accordion/variants';

export { default as CfSlider } from './slider/Slider.vue';
export type {
  SliderProps,
  SliderSize,
  SliderTone,
  SliderChangeMeta,
  SliderChangeSource,
} from './slider/variants';

export { default as CfDrawer } from './drawer/Drawer.vue';
export type {
  DrawerProps,
  DrawerPlacement,
  DrawerSize,
  DrawerTone,
  DrawerFooterAlign,
} from './drawer/variants';
export { drawer } from './drawer/service';
export type { DrawerServiceOptions } from './drawer/service';

export { default as CfPopover } from './popover/Popover.vue';
export type {
  PopoverProps,
  PopoverPlacement,
  PopoverTrigger,
} from './popover/variants';

export { default as CfDropdown } from './dropdown/Dropdown.vue';
export type {
  DropdownProps,
  DropdownPlacement,
  DropdownItem,
} from './dropdown/variants';

export { default as CfInputGroup } from './inputgroup/InputGroup.vue';
export type {
  InputGroupProps,
  InputGroupOrientation,
  InputGroupSize,
} from './inputgroup/variants';

export { default as CfOtpInput } from './otp/OtpInput.vue';
export type { OtpInputProps, OtpInputSize, OtpInputType } from './otp/variants';

export { default as CfForm } from './form/Form.vue';
export { default as CfFormField } from './form/FormField.vue';
export type {
  FormProps,
  FormFieldProps,
  FormLayout,
  FormSize,
  FieldRule,
  FieldRules,
  FieldErrors,
  ValidateTrigger,
} from './form/variants';

export { default as CfCombobox } from './combobox/Combobox.vue';
export type {
  ComboboxProps,
  ComboboxOption,
  ComboboxVariant,
  ComboboxSize,
  ComboboxValue,
} from './combobox/variants';

export { default as CfTagInput } from './taginput/TagInput.vue';
export type {
  TagInputProps,
  TagInputVariant,
  TagInputSize,
  TagInputTone,
} from './taginput/variants';

export { default as CfDropzone } from './dropzone/Dropzone.vue';
export type {
  DropzoneProps,
  DropzoneSize,
  DropzoneRejectReason,
  DropzoneRejection,
  DropzoneFileStatus,
} from './dropzone/variants';

export { default as CfColorPicker } from './colorpicker/ColorPicker.vue';
export type {
  ColorPickerProps,
  ColorPickerSize,
} from './colorpicker/variants';
export type { ColorFormat, RGB, RGBA, HSV, HSL } from './colorpicker/color';

export { default as CfDatePicker } from './datepicker/DatePicker.vue';
export type {
  DatePickerProps,
  DatePickerSize,
  DatePickerVariant,
  DatePickerView,
  DatePickerPreset,
} from './datepicker/variants';
export type { DateLike } from './datepicker/date';

export { default as CfDateRangePicker } from './daterangepicker/DateRangePicker.vue';
export type {
  DateRangePickerProps,
  DateRangeSize,
  DateRangeVariant,
  DateRangeValue,
} from './daterangepicker/variants';

export { default as CfBanner } from './banner/Banner.vue';
export type { BannerProps, BannerTone, BannerVariant } from './banner/variants';

export { default as CfPageHeader } from './pageheader/PageHeader.vue';
export type { PageHeaderProps, PageHeaderSize } from './pageheader/variants';

export { default as CfStepper } from './stepper/Stepper.vue';
export type {
  StepperProps,
  StepperVariant,
  StepperOrientation,
  StepperSize,
  StepStatus,
  StepItem,
} from './stepper/variants';

export { default as CfSplitter } from './splitter/Splitter.vue';
export type {
  SplitterProps,
  SplitterOrientation,
  SplitterUnit,
} from './splitter/variants';

export { default as CfAppShell } from './appshell/AppShell.vue';
export type { AppShellProps, AppShellVariant } from './appshell/variants';

export { default as CfSidebar } from './sidebar/Sidebar.vue';
export type {
  SidebarProps,
  SidebarSize,
  SidebarItem,
  SidebarGroup,
  SidebarEntry,
} from './sidebar/variants';

export { default as CfNavMenu } from './navmenu/NavMenu.vue';
export type {
  NavMenuProps,
  NavMenuItem,
  NavMenuLink,
  NavMenuVariant,
} from './navmenu/variants';

export { default as CfList } from './list/List.vue';
export type {
  ListProps,
  ListItem,
  ListSize,
  ListVariant,
  ListSelectable,
} from './list/variants';

export { default as CfDescriptionList } from './descriptionlist/DescriptionList.vue';
export type {
  DescriptionListProps,
  DescriptionItem,
  DescriptionListLayout,
  DescriptionListSize,
} from './descriptionlist/variants';

export { default as CfStat } from './stat/Stat.vue';
export type {
  StatProps,
  StatVariant,
  StatSize,
  StatTrend,
  StatTrendDirection,
} from './stat/variants';

export { default as CfTable } from './table/Table.vue';
export type {
  TableProps,
  TableColumn,
  TableSort,
  TableSize,
  TableVariant,
  TableAlign,
  SortDirection,
} from './table/variants';

export { default as CfTreeView } from './treeview/TreeView.vue';
export type {
  TreeViewProps,
  TreeNode,
  TreeViewSize,
} from './treeview/variants';

export { default as CfDataGrid } from './datagrid/DataGrid.vue';
export type {
  DataGridProps,
  DataGridColumn,
  DataGridCellEdit,
  DataGridSize,
} from './datagrid/variants';

export { default as CfKbd } from './kbd/Kbd.vue';
export type { KbdProps, KbdSize } from './kbd/variants';

export { default as CfLink } from './link/Link.vue';
export type { LinkProps, LinkVariant, LinkSize } from './link/variants';

export { default as CfInlineCode } from './code/InlineCode.vue';
export { default as CfCodeBlock } from './code/CodeBlock.vue';
export { default as CfCodeWorkspace } from './code/CodeWorkspace.vue';
export type {
  InlineCodeProps,
  CodeBlockProps,
  CodeBlockSize,
  CodeBlockTone,
  CodeWorkspaceFile,
  CodeWorkspaceBundle,
  CodeWorkspaceProps,
  CodeTreeItem,
} from './code/variants';
export {
  buildCodeTree,
  codeFileId,
  codeFileLanguage,
  detectLanguageFromName,
  escapeHtml as escapeCodeHtml,
  highlightCode,
  normalizeCodeIndent,
} from './code/variants';

export { default as CfAspectRatio } from './aspectratio/AspectRatio.vue';
export type { AspectRatioProps } from './aspectratio/variants';

export { default as CfRating } from './rating/Rating.vue';
export type { RatingProps, RatingSize } from './rating/variants';

export { default as CfToc } from './toc/Toc.vue';
export type { TocProps, TocItem } from './toc/variants';

export { default as CfScrollArea } from './scrollarea/ScrollArea.vue';
export type { ScrollAreaProps, ScrollAreaSize } from './scrollarea/variants';

export { default as CfSegmentedControl } from './segmented/SegmentedControl.vue';
export type {
  SegmentedProps,
  SegmentedItem,
  SegmentedSize,
  SegmentedAlign,
} from './segmented/variants';

export { default as CfKVEditor } from './kveditor/KVEditor.vue';
export type {
  KVEditorProps,
  KVEditorSize,
  KVRow,
} from './kveditor/variants';

export { default as CfJsonViewer } from './jsonviewer/JsonViewer.vue';
export type {
  JsonViewerProps,
  JsonViewerSize,
  JsonValueType,
} from './jsonviewer/variants';

export { default as CfJsonDiff } from './jsondiff/JsonDiff.vue';
export type {
  JsonDiffProps,
  JsonDiffSize,
  DiffOp,
  DiffLine,
} from './jsondiff/variants';

export { default as CfCalendar } from './calendar/Calendar.vue';
export type {
  CalendarProps,
  CalendarSize,
  DayCell,
} from './calendar/variants';

export { default as CfKanban } from './kanban/Kanban.vue';
export type {
  KanbanProps,
  KanbanSize,
  KanbanColumn,
  KanbanCard,
} from './kanban/variants';

export { default as CfMention } from './mention/Mention.vue';
export type {
  MentionProps,
  MentionSize,
  MentionOption,
} from './mention/variants';

export { default as CfBackTop } from './backtop/BackTop.vue';
export type { BackTopProps, BackTopSize } from './backtop/variants';

export { default as CfAffix } from './affix/Affix.vue';
export type { AffixProps } from './affix/variants';

export { default as CfWatermark } from './watermark/Watermark.vue';
export type { WatermarkProps } from './watermark/variants';

export { default as CfImage } from './image/Image.vue';
export type { ImageProps, ImageFit } from './image/variants';

export { default as CfTimeline } from './timeline/Timeline.vue';
export type {
  TimelineProps,
  TimelineItem,
  TimelineSize,
  TimelineMode,
  TimelineDotColor,
} from './timeline/variants';

export { default as CfTimelineGantt } from './timelinegantt/TimelineGantt.vue';
export type {
  TimelineGanttProps,
  GanttRow,
  GanttBar,
  GanttDependency,
  GanttUnit,
  GanttSize,
  GanttBarChangeMeta,
} from './timelinegantt/variants';

export { default as CfPivot } from './pivot/Pivot.vue';
export type {
  PivotProps,
  PivotAggregator,
  PivotSize,
  PivotResult,
} from './pivot/variants';
export { pivotCompute, aggregate as pivotAggregate } from './pivot/variants';

export { default as CfSpreadsheet } from './spreadsheet/Spreadsheet.vue';
export type {
  SpreadsheetProps,
  SpreadsheetSize,
  CellPos,
  CellRange,
} from './spreadsheet/variants';
export { toA1, colLetter, rangeToTSV, tsvToData } from './spreadsheet/variants';

export { default as CfResult } from './result/Result.vue';
export type { ResultProps, ResultStatus, ResultSize } from './result/variants';

export { default as CfStatistic } from './statistic/Statistic.vue';
export type { StatisticProps, StatisticSize } from './statistic/variants';

export { default as CfCarousel } from './carousel/Carousel.vue';
export type { CarouselProps, CarouselItem, CarouselSize } from './carousel/variants';

export { default as CfCascader } from './cascader/Cascader.vue';
export type {
  CascaderProps,
  CascaderOption,
  CascaderSize,
} from './cascader/variants';

export { default as CfMarquee } from './marquee/Marquee.vue';
export type { MarqueeProps, MarqueeDirection } from './marquee/variants';

export { default as CfFloatButton } from './floatbutton/FloatButton.vue';
export type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonVariant,
} from './floatbutton/variants';

export { default as CfAnchor } from './anchor/Anchor.vue';
export type { AnchorProps, AnchorItem } from './anchor/variants';

export { default as CfImagePreview } from './imagepreview/ImagePreview.vue';
export type { ImagePreviewProps } from './imagepreview/variants';

export { default as CfTimePicker } from './timepicker/TimePicker.vue';
export type { TimePickerProps, TimePickerSize } from './timepicker/variants';

export { default as CfTransfer } from './transfer/Transfer.vue';
export type { TransferProps, TransferItem } from './transfer/variants';

export { default as CfHighlight } from './highlight/Highlight.vue';
export type { HighlightProps, HighlightSegment } from './highlight/variants';

export { default as CfTextEllipsis } from './textellipsis/TextEllipsis.vue';
export type { TextEllipsisProps } from './textellipsis/variants';

export { default as CfCountDown } from './countdown/CountDown.vue';
export type { CountDownProps, CountDownSize } from './countdown/variants';

export { default as CfInfiniteScroll } from './infinitescroll/InfiniteScroll.vue';
export type { InfiniteScrollProps } from './infinitescroll/variants';

export { default as CfTimeRangePicker } from './timerangepicker/TimeRangePicker.vue';
export type {
  TimeRangePickerProps,
  TimeRangeSize,
  TimeRangeValue,
} from './timerangepicker/variants';

export { default as CfCalendarHeatmap } from './calendarheatmap/CalendarHeatmap.vue';
export type {
  CalendarHeatmapProps,
  HeatmapDay,
  HeatmapCell,
} from './calendarheatmap/variants';

export { default as CfTour } from './tour/Tour.vue';
export type { TourProps, TourStep, TourPlacement } from './tour/variants';

export { default as CfQRCode } from './qrcode/QRCode.vue';
export type { QRCodeProps, QrEcc } from './qrcode/variants';

// CfMap and the geographic map family moved to `@chufix-design/maps-vue`

export { default as CfIcon } from './icon/Icon.vue';
export type {
  IconProps,
  IconSize,
  IconStrokeWidth,
} from './icon/variants';
export type { IconName } from '@chufix-design/icons';

// Data / virtualization / SpeedDial
export { default as CfSpeedDial } from './speeddial/SpeedDial.vue';
export type { SpeedDialProps, SpeedDialAction, SpeedDialDirection, SpeedDialPosition, SpeedDialTrigger, SpeedDialLabelMode } from './speeddial/variants';
export { default as CfBulkSelectionBar } from './bulkselectionbar/BulkSelectionBar.vue';
export type { BulkSelectionBarProps, BulkBarPosition } from './bulkselectionbar/variants';
export { default as CfColumnVisibilityMenu } from './columnvisibilitymenu/ColumnVisibilityMenu.vue';
export type { ColumnVisibilityMenuProps, ColumnConfig, ColumnPin } from './columnvisibilitymenu/variants';
export { default as CfMasonry } from './masonry/Masonry.vue';
export type { MasonryProps } from './masonry/variants';
export { default as CfVirtualList } from './virtuallist/VirtualList.vue';
export type { VirtualListProps, VirtualWindow, ItemHeight } from './virtuallist/variants';
export { default as CfVirtualGrid } from './virtualgrid/VirtualGrid.vue';
export type { VirtualGridProps, GridWindow } from './virtualgrid/variants';
export { default as CfTreeTable } from './treetable/TreeTable.vue';
export type { TreeTableProps, TreeTableColumn, FlatTreeRow } from './treetable/variants';
export { default as CfFilterPanel } from './filterpanel/FilterPanel.vue';
export { default as CfFilterSection } from './filterpanel/FilterSection.vue';
export type { FilterPanelProps, FilterSectionProps, SavedView } from './filterpanel/variants';

// AI / LLM chat components
export { default as CfStreamingText } from './streamingtext/StreamingText.vue';
export type { StreamingTextProps, StreamingCursor, StreamingFormat } from './streamingtext/variants';
export { default as CfCitationMark } from './citationmark/CitationMark.vue';
export type { CitationMarkProps, CitationSource } from './citationmark/variants';
export { default as CfTokenMeter } from './tokenmeter/TokenMeter.vue';
export type { TokenMeterProps, TokenMeterSegment, TokenMeterTone } from './tokenmeter/variants';
export { default as CfChatBubble } from './chatbubble/ChatBubble.vue';
export type { ChatBubbleProps, ChatRole, ChatBubbleState, ChatAuthor } from './chatbubble/variants';
export { default as CfModelPicker } from './modelpicker/ModelPicker.vue';
export type { ModelPickerProps, ModelOption } from './modelpicker/variants';
export { default as CfThinkingTrace } from './thinkingtrace/ThinkingTrace.vue';
export type { ThinkingTraceProps, ThinkingStatus } from './thinkingtrace/variants';
export { default as CfToolCallCard } from './toolcallcard/ToolCallCard.vue';
export type { ToolCallCardProps, ToolCallStatus } from './toolcallcard/variants';
export { default as CfArtifactCard } from './artifactcard/ArtifactCard.vue';
export type { ArtifactCardProps, ArtifactKind, ArtifactActions } from './artifactcard/variants';
export { default as CfChatList } from './chatlist/ChatList.vue';
export type { ChatListProps, ChatGroupBy } from './chatlist/variants';
export { default as CfPromptComposer } from './promptcomposer/PromptComposer.vue';
export type {
  PromptComposerProps,
  PromptAttachment,
  SlashCommand,
  MentionItem,
  SubmitKey,
} from './promptcomposer/variants';

// Mobile / touch components
export { default as CfBottomSheet } from './bottomsheet/BottomSheet.vue';
export type { BottomSheetProps, SheetSnap } from './bottomsheet/variants';
export { default as CfPullToRefresh } from './pulltorefresh/PullToRefresh.vue';
export type { PullToRefreshProps, PullStage } from './pulltorefresh/variants';
export { default as CfSwipeAction } from './swipeaction/SwipeAction.vue';
export type { SwipeActionProps, SwipeActionItem, SwipeActionTone } from './swipeaction/variants';
export { default as CfFab } from './fab/Fab.vue';
export type { FabProps, FabSize, FabVariant, FabPosition } from './fab/variants';
export { default as CfTabBar } from './tabbar/TabBar.vue';
export type { TabBarProps, TabBarItem, TabBarVariant } from './tabbar/variants';

// Form advanced
export { default as CfFieldRow } from './fieldrow/FieldRow.vue';
export type { FieldRowProps, FieldRowLayout, FieldRowSize } from './fieldrow/variants';
export { default as CfFormGrid } from './formgrid/FormGrid.vue';
export type { FormGridProps, FormGridColumns } from './formgrid/variants';
export { default as CfFormSection } from './formsection/FormSection.vue';
export type { FormSectionProps } from './formsection/variants';
export { default as CfFormSchema } from './formschema/FormSchema.vue';
export type {
  FormSchemaProps,
  FormFieldDef,
  FormFieldType,
  FormFieldOption,
} from './formschema/variants';

// Map family (CfMap / CfMapMiniMap / CfChoroplethMap / CfFlowMap / CfMapTile /
// CfMapLegend / CfMapScale / CfBubbleMap / CfHeatMap / CfMarkerCluster) was
// moved to `@chufix-design/maps-vue`. Install separately:
//   pnpm add @chufix-design/maps-vue
// and import from there.

// Composables (Vue 3 composition-API utilities, no UI).
export * from './composables';
