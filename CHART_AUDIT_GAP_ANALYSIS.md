# ChuFix Chart Components — Comprehensive Gap Analysis

> Generated from source `variants.ts` + MDX documentation audit.
> Each section lists ALL props from source, emits, MDX coverage, and gaps.

---

## 1. LineChart 折线图

**ALL source props** (from `LineChartProps`):
- `series`: `LineSeries[]` (required) — `{ name?: string; data: number[] }[]`
- `labels`: `string[]` = undefined (auto 0..n-1)
- `width`: `number` = 480
- `height`: `number` = 240
- `smooth`: `boolean` = false
- `showGrid`: `boolean` = true
- `showLabels`: `boolean` = true
- `showLegend`: `boolean` = (not in MDX)
- `showTooltip`: `boolean` = (not in MDX)
- `yLabelFn`: `(v: number) => string` = v.toFixed(0)
- `valueFormatter`: `(value: number, item: LineChartTooltipItem) => string` = undefined
- `tooltipFormatter`: `(payload: LineChartInteractionPayload) => string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**:
- `item-enter(payload: LineChartInteractionPayload)`
- `item-leave(payload: LineChartInteractionPayload)`
- `legend-toggle(index: number, hidden: boolean)`

**Current MDX sections**: 基础用法, 平滑曲线, 多 series, API
**Props in MDX API table**: series, labels, width/height, smooth, showGrid/showLabels, yLabelFn
**Props MISSING from MDX API table**:
- `showLegend`
- `showTooltip`
- `valueFormatter`
- `tooltipFormatter`
- `ariaLabel`

**Emits MISSING from MDX**: ALL (item-enter, item-leave, legend-toggle)

**Missing demos**:
- Custom tooltip formatting demo
- Legend toggle interaction demo
- yLabelFn formatting demo (currency, percentage)
- Accessibility (ariaLabel) usage

**Suggested additional examples**:
- Real-time streaming data (append points)
- Large dataset (100+ points) performance
- Custom value formatter for currency/percentage tooltips
- Programmatic legend toggle

---

## 2. AreaChart 面积图

**ALL source props** (from `AreaChartProps`):
- `series`: `AreaSeries[]` (required) — `{ name?: string; data: number[] }[]`
- `labels`: `string[]` = undefined
- `width`: `number` = 480
- `height`: `number` = 240
- `smooth`: `boolean` = false
- `stacked`: `boolean` = false
- `showGrid`: `boolean` = true
- `showLabels`: `boolean` = true
- `showLegend`: `boolean` = (not in MDX)
- `showTooltip`: `boolean` = (not in MDX)
- `valueFormatter`: `(value: number, item: AreaChartTooltipItem) => string` = undefined
- `tooltipFormatter`: `(payload: AreaChartInteractionPayload) => string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**:
- `item-enter(payload: AreaChartInteractionPayload)`
- `item-leave(payload: AreaChartInteractionPayload)`
- `legend-toggle(index: number, hidden: boolean)`

**Current MDX sections**: 基础用法, 堆叠模式, API
**Props in MDX API table**: series, stacked, smooth, width/height/showGrid/showLabels (grouped)
**Props MISSING from MDX API table**:
- `labels`
- `showLegend`
- `showTooltip`
- `valueFormatter`
- `tooltipFormatter`
- `ariaLabel`

**Emits MISSING from MDX**: ALL (item-enter, item-leave, legend-toggle)

**Missing demos**:
- Custom tooltip formatting
- Legend toggle interaction
- Non-stacked multi-series comparison
- Gradient fill customization

**Suggested additional examples**:
- Revenue breakdown over time (stacked)
- CPU/Memory usage monitoring (non-stacked comparison)
- Custom tooltip with percentage of total

---

## 3. Sparkline 缩略走势

**ALL source props** (from `SparklineProps`):
- `data`: `number[]` (required)
- `width`: `number` = 80
- `height`: `number` = 24
- `filled`: `boolean` = false
- `smooth`: `boolean` = false
- `colorIndex`: `number` (0..7) = 0
- `showDot`: `boolean` = true
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 8 色调色板, API
**Props in MDX API table**: data, width/height, filled, smooth, colorIndex, showDot
**Props MISSING from MDX API table**:
- `ariaLabel`

**Emits MISSING from MDX**: N/A (none defined)

**Missing demos**:
- Inline usage within a table cell
- Negative values handling
- Without dot (showDot=false)

**Suggested additional examples**:
- Dashboard KPI row with multiple sparklines
- Sparkline inside MetricCard (cross-component)
- Responsive width adaptation

---

## 4. CandlestickChart K 线图

**ALL source props** (from `CandlestickChartProps`):
- `data`: `Candle[]` (required) — `{ open, high, low, close, label? }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 上行/下行趋势, API
**Props in MDX API table**: data
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Volume overlay
- Custom time labels
- Responsive sizing

**Suggested additional examples**:
- Stock ticker with date labels
- Crypto price chart (high volatility)
- Combined with ChartCrosshair for price readout

---

## 5. BarChart 柱状图

**ALL source props** (from `BarChartProps`):
- `data`: `number[]` (required)
- `labels`: `string[]` = undefined
- `width`: `number` = 480
- `height`: `number` = 240
- `colorIndex`: `number` (0..7) = 0
- `orientation`: `'vertical' | 'horizontal'` = 'vertical'
- `showGrid`: `boolean` = true
- `showLabels`: `boolean` = true
- `showTooltip`: `boolean` = (not in MDX)
- `valueFormatter`: `(value: number, payload: BarChartInteractionPayload) => string` = undefined
- `tooltipFormatter`: `(payload: BarChartInteractionPayload) => string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**:
- `item-enter(payload: BarChartInteractionPayload)`
- `item-leave(payload: BarChartInteractionPayload)`

**Current MDX sections**: 基础用法, 颜色, 横向布局, API
**Props in MDX API table**: data, labels, colorIndex, orientation, width/height/showGrid/showLabels (grouped)
**Props MISSING from MDX API table**:
- `showTooltip`
- `valueFormatter`
- `tooltipFormatter`
- `ariaLabel`

**Emits MISSING from MDX**: ALL (item-enter, item-leave)

**Missing demos**:
- Custom tooltip formatting
- Negative values (diverging bar)
- Hover interaction event handling

**Suggested additional examples**:
- Top-N ranking (horizontal + sorted)
- Budget vs actual comparison
- Click-to-drill-down pattern

---

## 6. Histogram 直方图

**ALL source props** (from `HistogramProps`):
- `bins`: `HistogramBin[]` (required) — `{ label: string; count: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `colorIndex`: `number` (0..7) = 0
- `showLabels`: `boolean` = true
- `showTooltip`: `boolean` = (not in MDX)
- `tooltipFormatter`: `(payload: HistogramInteractionPayload) => string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**:
- `item-enter(payload: HistogramInteractionPayload)`
- `item-leave(payload: HistogramInteractionPayload)`

**Current MDX sections**: 基础用法, 两种典型分布, API
**Props in MDX API table**: bins, colorIndex, showLabels
**Props MISSING from MDX API table**:
- `width`
- `height`
- `showTooltip`
- `tooltipFormatter`
- `ariaLabel`

**Emits MISSING from MDX**: ALL (item-enter, item-leave)

**Missing demos**:
- Custom tooltip with percentage
- Different bin widths
- Hover interaction

**Suggested additional examples**:
- Response time distribution
- Score distribution with percentile markers
- Log-scale bin labels

---

## 7. StackedBar100 100% 占比柱

**ALL source props** (from `StackedBar100Props`):
- `segments`: `StackedBar100Series[]` (required) — `{ name: string; value: number; colorIndex?: number }[]`
- `width`: `number` = (default)
- `height`: `number` = 24
- `showLegend`: `boolean` = true
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 趋势对比, API
**Props in MDX API table**: segments, height, showLegend
**Props MISSING from MDX API table**:
- `width`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom width
- Without legend (compact mode)
- Accessibility usage

**Suggested additional examples**:
- Browser market share comparison
- Budget allocation breakdown
- A/B test traffic split

---

## 8. BulletChart 子弹图

**ALL source props** (from `BulletChartProps`):
- `value`: `number` (required)
- `target`: `number` = undefined
- `max`: `number` (required)
- `bands`: `{ upTo: number; tone?: 'error' | 'warning' | 'success' }[]` = []
- `width`: `number` = (default)
- `height`: `number` = (default)
- `label`: `string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 质量带 + 超过目标, API
**Props in MDX API table**: value, target, max, bands, label
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Multiple bullet charts stacked (KPI dashboard)
- Without target line
- Custom sizing

**Suggested additional examples**:
- Sales quota progress
- SLA compliance meter
- Multiple KPIs in a row

---

## 9. DonutChart 环形图

**ALL source props** (from `DonutChartProps`):
- `segments`: `DonutSegment[]` (required) — `{ name: string; value: number; colorIndex?: number }[]`
- `size`: `number` = 180
- `thickness`: `number` = 24
- `showLegend`: `boolean` = true
- `centerLabel`: `string` = undefined
- `centerValue`: `string | number` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 不同厚度, API
**Props in MDX API table**: segments, size, thickness, centerValue/centerLabel, showLegend
**Props MISSING from MDX API table**:
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Without legend
- Interactive segment highlight
- Small size (mini donut)

**Suggested additional examples**:
- Storage usage breakdown
- Portfolio allocation
- Progress ring (single segment)

---

## 10. FunnelChart 漏斗图

**ALL source props** (from `FunnelChartProps`):
- `steps`: `FunnelStep[]` (required) — `{ label: string; value: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `showLabels`: `boolean` = true
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 好坏漏斗对比, API
**Props in MDX API table**: steps, width/height/showLabels (grouped, no defaults shown)
**Props MISSING from MDX API table**:
- `ariaLabel`
- Individual `width`, `height`, `showLabels` defaults not documented

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Conversion rate annotations
- Without labels (compact)
- Custom sizing

**Suggested additional examples**:
- E-commerce checkout funnel
- Recruitment pipeline
- Marketing funnel with drop-off percentages

---

## 11. Treemap 矩形树图

**ALL source props** (from `TreemapProps`):
- `nodes`: `TreemapNode[]` (required) — `{ name: string; value: number; colorIndex?: number }[]`
- `width`: `number` = 480
- `height`: `number` = 240
- `showLabels`: `boolean` = true
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, label 显隐, API
**Props in MDX API table**: nodes, width/height
**Props MISSING from MDX API table**:
- `showLabels` (demonstrated in demo but not in API table)
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom colorIndex per node
- Large dataset (20+ nodes)
- Responsive sizing

**Suggested additional examples**:
- Disk usage visualization
- Stock market sector map
- Package bundle size analysis

---

## 12. SankeyDiagram 流向图

**ALL source props** (from `SankeyDiagramProps`):
- `nodes`: `SankeyNode[]` (required) — `{ id: string; name: string; layer?: number; colorIndex?: number }[]`
- `links`: `SankeyLink[]` (required) — `{ source: string; target: string; value: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `nodeWidth`: `number` = 12
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 购物路径 3 层, API
**Props in MDX API table**: nodes, links, nodeWidth
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom layer assignment
- Custom node colors
- Large multi-layer flow

**Suggested additional examples**:
- Website traffic flow (source → page → action)
- Energy flow diagram
- Budget allocation flow

---

## 13. ScatterPlot 散点图

**ALL source props** (from `ScatterPlotProps`):
- `data`: `ScatterPoint[]` (required) — `{ x: number; y: number; r?: number; group?: string; label?: string }[]`
- `width`: `number` = 480
- `height`: `number` = 240
- `showGrid`: `boolean` = (default)
- `showTooltip`: `boolean` = (default)
- `tooltipFormatter`: `(payload: ScatterPlotInteractionPayload) => string` = undefined
- `ariaLabel`: `string` = undefined

**Source emits**:
- `item-enter(payload: ScatterPlotInteractionPayload)`
- `item-leave(payload: ScatterPlotInteractionPayload)`

**Current MDX sections**: 基础用法, 多 group 聚类, API
**Props in MDX API table**: data, width/height
**Props MISSING from MDX API table**:
- `showGrid`
- `showTooltip`
- `tooltipFormatter`
- `ariaLabel`

**Emits MISSING from MDX**: ALL (item-enter, item-leave)

**Missing demos**:
- Bubble chart (using `r` for radius)
- Custom tooltip
- Point labels
- Hover interaction

**Suggested additional examples**:
- Correlation analysis (height vs weight)
- Bubble chart with size encoding
- Cluster visualization with group colors

---

## 14. BoxPlot 箱线图

**ALL source props** (from `BoxPlotProps`):
- `data`: `BoxStat[]` (required) — `{ label: string; min: number; q1: number; median: number; q3: number; max: number; outliers?: number[] }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, API 延迟分布, API
**Props in MDX API table**: data
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom sizing
- Single box (single distribution)
- Outlier highlighting

**Suggested additional examples**:
- A/B test result comparison
- Salary distribution by department
- Performance benchmark comparison

---

## 15. RadarChart 雷达图

**ALL source props** (from `RadarChartProps`):
- `axes`: `string[]` (required)
- `series`: `RadarSeries[]` (required) — `{ name: string; values: number[]; colorIndex?: number }[]`
- `size`: `number` = 240
- `max`: `number` = (computed from data)
- `showLegend`: `boolean` = (default)
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 多 series 对比, API
**Props in MDX API table**: axes, series, size, max
**Props MISSING from MDX API table**:
- `showLegend`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Single series (skill chart)
- Custom max value
- Legend toggle

**Suggested additional examples**:
- Player stats comparison (gaming)
- Product feature comparison
- Team skill assessment

---

## 16. RidgePlot 密度脊图

**ALL source props** (from `RidgePlotProps`):
- `rows`: `RidgeRow[]` (required) — `{ label: string; density: number[]; colorIndex?: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `overlap`: `number` (0..1) = 0.6
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 多峰分布, API
**Props in MDX API table**: rows, overlap
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom overlap values (0.3 vs 0.8)
- Custom colors per row
- Wide dataset (many bins)

**Suggested additional examples**:
- Temperature distribution by month
- Response time distribution by endpoint
- User activity distribution by day of week

---

## 17. Gauge 仪表盘

**ALL source props** (from `GaugeProps`):
- `value`: `number` (required)
- `min`: `number` = 0
- `max`: `number` = 100
- `size`: `number` = 160
- `thickness`: `number` = 10
- `sweep`: `number` = 270
- `label`: `string` = undefined
- `unit`: `string` = undefined
- `tone`: `'accent' | 'success' | 'warning' | 'error'` = 'accent'
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 扫角度, API
**Props in MDX API table**: value, min/max, size, thickness, sweep, tone, unit/label
**Props MISSING from MDX API table**:
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- All 4 tones side by side
- Custom min/max range (e.g., -20 to 50 for temperature)
- Dynamic value update (animated)

**Suggested additional examples**:
- Server CPU usage gauge
- Temperature gauge with custom range
- Multiple gauges dashboard row

---

## 18. MetricCard 指标卡

**ALL source props** (from `MetricCardProps`):
- `label`: `string` (required)
- `value`: `string | number` (required)
- `prefix`: `string` = undefined
- `suffix`: `string` = undefined
- `unit`: `string` = undefined
- `hint`: `string` = undefined
- `delta`: `number` = undefined
- `trend`: `number[] | 'up' | 'down' | 'flat'` = undefined
- `deltaFn`: `(delta: number) => string` = undefined (default: "+N%")
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 网格布局, API
**Props in MDX API table**: label, value, unit, delta, trend
**Props MISSING from MDX API table**:
- `prefix`
- `suffix`
- `hint`
- `deltaFn`
- `ariaLabel`
- `trend` preset values ('up' | 'down' | 'flat') not documented

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Prefix/suffix usage (currency symbol, %)
- Hint text below value
- Custom deltaFn formatting
- Trend presets ('up', 'down', 'flat')

**Suggested additional examples**:
- Revenue card with $ prefix
- Latency card with "ms" suffix
- Card with hint explaining the metric
- Custom delta format (absolute vs percentage)

---

## 19. TimingBar 请求瀑布

**ALL source props** (from `TimingBarProps`):
- `phases`: `TimingPhase[]` (required) — `{ label: string; start: number; end: number; colorIndex?: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `totalLabel`: `string` = undefined
- `showAxis`: `boolean` = true
- `labelMode`: `'auto' | 'all' | 'none'` = 'auto'
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 真实瀑布场景, API
**Props in MDX API table**: phases, showAxis, labelMode
**Props MISSING from MDX API table**:
- `width`
- `height`
- `totalLabel`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- totalLabel usage
- labelMode='none' (compact)
- Custom width/height

**Suggested additional examples**:
- HTTP request waterfall (DNS/TCP/TLS/TTFB/Download)
- CI/CD pipeline stages
- Page load timing breakdown

---

## 20. LatencyHeatmap 延迟热力图

**ALL source props** (from `LatencyHeatmapProps`):
- `data`: `number[][]` (required) — rows × cols matrix
- `rowLabels`: `string[]` = undefined
- `colLabels`: `string[]` = undefined
- `width`: `number` = (default)
- `height`: `number` = (default)
- `min`: `number` = (computed from data)
- `max`: `number` = (computed from data)
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 一周 × 24 小时, API
**Props in MDX API table**: data, rowLabels/colLabels, min/max
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom min/max for fixed scale
- Custom sizing
- Sparse data handling

**Suggested additional examples**:
- Server response time by hour/day
- Error rate heatmap
- Correlation matrix visualization

---

## 21. ConnectionGraph 连接图

**ALL source props** (from `ConnectionGraphProps`):
- `nodes`: `GraphNode[]` (required) — `{ id: string; label: string; x?: number; y?: number; colorIndex?: number; size?: number }[]`
- `edges`: `GraphEdge[]` (required) — `{ source: string; target: string; weight?: number; colorIndex?: number }[]`
- `width`: `number` = (default)
- `height`: `number` = (default)
- `showLabels`: `boolean` = true
- `ariaLabel`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, 微服务拓扑, API
**Props in MDX API table**: nodes, edges, showLabels
**Props MISSING from MDX API table**:
- `width`
- `height`
- `ariaLabel`

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Custom node positions (x, y)
- Edge weight visualization
- Custom node sizes
- Edge colors

**Suggested additional examples**:
- Microservice dependency graph with health colors
- Social network visualization
- Database entity relationship diagram

---

## 22. ChartCrosshair 图表十字线

**ALL source props** (from `ChartCrosshairProps`):
- `visible`: `boolean` = true
- `x`: `number` = undefined
- `y`: `number` = undefined
- `width`: `number` (required)
- `height`: `number` (required)
- `showVertical`: `boolean` = true
- `showHorizontal`: `boolean` = false
- `tooltip`: `string` = undefined

**Source emits**: none

**Current MDX sections**: 基础用法, API
**Props in MDX API table**: visible, x/y, width/height, showVertical/showHorizontal, tooltip
**Props MISSING from MDX API table**: (none — all documented)

**Emits MISSING from MDX**: N/A

**Missing demos**:
- Combined with LineChart (real integration)
- Horizontal-only crosshair
- Dynamic tooltip content

**Suggested additional examples**:
- Price readout on candlestick chart
- Synchronized crosshair across multiple charts
- Snap-to-point behavior

---

## 23. ChartToolbar 图表工具栏

**ALL source props** (from `ChartToolbarProps`):
- `title`: `string` = undefined
- `subtitle`: `string` = undefined
- `series`: `LegendSeries[]` = undefined — `{ name: string; colorIndex: number; hidden?: boolean }[]`
- `showZoom`: `boolean` = false
- `showExport`: `boolean` = false
- `showRefresh`: `boolean` = false

**Source emits**:
- `series-toggle(name: string, series: LegendSeries)`
- `action(kind: 'zoom-in' | 'zoom-out' | 'export' | 'refresh')`

**Current MDX sections**: 基础用法, 交互联动, API
**Props in MDX API table**: title/subtitle, series, showZoom/showExport/showRefresh
**Props MISSING from MDX API table**: (none — all documented)

**Emits MISSING from MDX**: Partially covered (series-toggle shown in demo code, but `action` emit not documented in API table)

**Missing demos**:
- Zoom/Export/Refresh button handlers
- Action emit handling
- Toolbar with subtitle

**Suggested additional examples**:
- Full toolbar with all buttons + chart
- Export to PNG/CSV pattern
- Refresh with loading state

---

## Summary: Cross-Cutting Gaps

### Universally Missing from MDX

| Gap | Affected Components |
|-----|-------------------|
| `ariaLabel` prop not documented | ALL 23 components |
| `width`/`height` not in API table | CandlestickChart, Histogram, StackedBar100, BulletChart, FunnelChart, SankeyDiagram, BoxPlot, RidgePlot, TimingBar, LatencyHeatmap, ConnectionGraph |
| `showTooltip` not documented | LineChart, AreaChart, BarChart, Histogram, ScatterPlot |
| `tooltipFormatter` not documented | LineChart, AreaChart, BarChart, Histogram, ScatterPlot |
| `valueFormatter` not documented | LineChart, AreaChart, BarChart |
| Emits not documented at all | LineChart, AreaChart, BarChart, Histogram, ScatterPlot |
| `showLegend` not documented | LineChart, AreaChart, RadarChart |

### Documentation Pattern Issues

1. **No "Events" section** — No MDX file documents emits/events in the API table
2. **Grouped props without defaults** — Several MDX files group props like `width / height / showGrid / showLabels` without individual defaults
3. **No accessibility section** — `ariaLabel` exists on every component but is never documented
4. **No interaction/event demos** — Components with emits (LineChart, AreaChart, BarChart, Histogram, ScatterPlot, ChartToolbar) lack event-handling demos
5. **Formatter functions undocumented** — `valueFormatter`, `tooltipFormatter`, `deltaFn` are powerful customization points with zero documentation

### Priority Fixes (High Impact)

1. Add **Events/Emits** section to: LineChart, AreaChart, BarChart, Histogram, ScatterPlot, ChartToolbar
2. Document **tooltipFormatter / valueFormatter** with examples for: LineChart, AreaChart, BarChart, Histogram, ScatterPlot
3. Add **MetricCard** missing props: prefix, suffix, hint, deltaFn, trend presets
4. Add **ariaLabel** to a shared "Accessibility" note (or per-component)
5. Standardize **width/height** documentation across all components with actual defaults
