---
'@chufix-design/tokens': minor
'@chufix-design/icons': minor
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/cli': minor
---

移动端 / 触控组件家族

新组件
- `CfBottomSheet` —— 多停靠点（snap points）、grabber 拖动、下滑关闭、iOS 安全区适配
- `CfPullToRefresh` —— 仅在 scrollTop=0 时启动；弹性阻尼、阈值反馈、受控刷新状态
- `CfSwipeAction` —— 列表行左右滑暴露 action rail；velocity 或位移阈值吸附；点外关闭
- `CfFab` —— 3 size × 3 variant × 3 position；extended pill、hideOnScroll、badge、safe-area
- `CfTabBar` —— 底部路由级 tab；line / fill 激活样式、badge、safeArea padding

手势 utility（Vue composable + React hook 镜像）
- `useDrag` —— 通用拖拽底座：pointer-capture、轴向限制、阈值起拖、bounds 夹紧、100ms 速度窗口
- `useSwipe` —— 四方向识别，在 useDrag 之上按 threshold 或 velocity 判定

现有组件增强
- `CfDrawer placement='bottom'` —— 新增 `showGrabber`、`dismissible` props；默认在 bottom 方向开启 grabber 与 swipe-down 关闭；自动加 `padding-bottom: env(safe-area-inset-bottom)`
- `CfCarousel` —— 接入 useSwipe 支持移动端左右滑切换；保留 autoplay / indicator / 控制按钮

Token 增量
- `--touch-target-min: 48px`（Apple HIG 44pt / Material 48dp 取大）
- `--bp-sm/md/lg/xl: 640 / 768 / 1024 / 1280px`（与 Tailwind 默认对齐）
- `--safe-area-top/right/bottom/left: env(safe-area-inset-*, 0px)`
- `--z-fab: 950`、`--z-bottomsheet: 1350`

文档
- DemoFrame 新增视口切换器（Desktop / 414 / 375px），选择持久化到 localStorage
- 新增 `/components/{bottomsheet,pulltorefresh,swipeaction,fab,tabbar}/` 5 个页面
- composables 文档新增「手势」章节涵盖 useDrag / useSwipe
- sidebar 加「移动端 / 触控」分组
